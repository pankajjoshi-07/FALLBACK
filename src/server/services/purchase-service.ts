import { prisma } from "../db/prisma";
import { validatePurchase, validateEquipment } from "../game/economy";
import { evaluateNewAchievements } from "../game/achievements";
import crypto from "crypto";

export interface PurchaseItemResult {
  ok: boolean;
  isReplay?: boolean;
  data?: {
    item: {
      id: string;
      slug: string;
      name: string;
      category: string;
      price: number;
    };
    character: {
      gold: number;
      level: number;
      stateVersion: number;
    };
  };
  events?: Array<{
    id: string;
    type: "PURCHASE_COMPLETED" | "ACHIEVEMENT_UNLOCKED";
    payload: Record<string, unknown>;
  }>;
  stateVersion?: number;
  error?: {
    code: string;
    message: string;
    status: number;
  };
}

export async function purchaseItemTransaction(params: {
  userId: string;
  itemId: string;
  idempotencyKey?: string;
  serverDate?: Date;
}): Promise<PurchaseItemResult> {
  const { userId, itemId } = params;
  const serverDate = params.serverDate || new Date();
  const idempotencyKey = params.idempotencyKey || `auto-${crypto.randomUUID()}`;

  const requestFingerprint = crypto
    .createHash("sha256")
    .update(`purchase:${userId}:${itemId}`)
    .digest("hex");

  // Step 1: Check idempotency receipt
  const existingReceipt = await prisma.mutationReceipt.findUnique({
    where: {
      userId_idempotencyKey: {
        userId,
        idempotencyKey,
      },
    },
  });

  if (existingReceipt) {
    if (existingReceipt.requestHash === requestFingerprint) {
      const payload = JSON.parse(existingReceipt.responsePayload);
      return {
        ...payload,
        isReplay: true,
      };
    } else {
      return {
        ok: false,
        error: {
          code: "IDEMPOTENCY_MISMATCH",
          message: "The provided Idempotency-Key was previously used with different parameters.",
          status: 409,
        },
      };
    }
  }

  // Step 2: Atomic purchase transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { character: true },
      });

      if (!user || !user.character) {
        throw { code: "USER_NOT_FOUND", message: "User not found.", status: 404 };
      }

      const item = await tx.shopItem.findUnique({
        where: { id: itemId },
      });

      if (!item || !item.active) {
        throw { code: "ITEM_NOT_FOUND", message: "Item not found or unavailable.", status: 404 };
      }

      const existingOwnership = await tx.inventoryItem.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });

      const validation = validatePurchase(
        item,
        { gold: user.character.gold, level: user.character.lifetimeXp ? Math.max(1, Math.floor(user.character.lifetimeXp / 100)) : 1 },
        Boolean(existingOwnership)
      );

      // Re-verify against real derived level
      const currentLevel = (await import("../game/progression")).calculateLevelFromTotalXp(user.character.lifetimeXp).level;
      if (currentLevel < item.levelRequirement) {
        throw {
          code: "LEVEL_TOO_LOW",
          message: `Requires Level ${item.levelRequirement}. Current Level is ${currentLevel}.`,
          status: 409,
        };
      }

      if (user.character.gold < item.price) {
        throw {
          code: "INSUFFICIENT_GOLD",
          message: `You require ${item.price - user.character.gold} more Gold to purchase ${item.name}.`,
          status: 409,
        };
      }

      if (existingOwnership) {
        throw {
          code: "ALREADY_OWNED",
          message: "You already own this permanent cosmetic relic.",
          status: 409,
        };
      }

      const newGold = user.character.gold - item.price;

      // Deduct gold & update character stateVersion
      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          gold: newGold,
          stateVersion: { increment: 1 },
        },
      });

      // Add to inventory
      const inventoryRecord = await tx.inventoryItem.create({
        data: {
          userId,
          itemId,
          acquiredAt: serverDate,
        },
      });

      // Add gold ledger debit
      await tx.goldLedger.create({
        data: {
          userId,
          amount: -item.price,
          balanceAfter: newGold,
          sourceType: "SHOP_PURCHASE",
          sourceId: inventoryRecord.id,
          description: `Purchased ${item.name}`,
          createdAt: serverDate,
        },
      });

      // Check achievements
      const totalInventory = await tx.inventoryItem.count({ where: { userId } });
      const totalQuests = await tx.completionLog.count({ where: { userId } });
      const existingUserAchievements = await tx.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      });
      const unlockedSlugs = new Set(existingUserAchievements.map((ua) => ua.achievement.slug));

      const newSlugs = evaluateNewAchievements({
        totalCompletedQuests: totalQuests,
        currentStreak: updatedCharacter.currentStreak,
        level: currentLevel,
        intellectXp: updatedCharacter.intellectXp,
        purchasedItemsCount: totalInventory,
        bossDefeated: false,
        unlockedAchievementSlugs: unlockedSlugs,
      });

      const events: PurchaseItemResult["events"] = [
        {
          id: `purchase-${inventoryRecord.id}`,
          type: "PURCHASE_COMPLETED",
          payload: {
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            remainingGold: newGold,
          },
        },
      ];

      for (const slug of newSlugs) {
        const achievement = await tx.achievement.findUnique({ where: { slug } });
        if (achievement) {
          await tx.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              unlockedAt: serverDate,
            },
          });
          events.push({
            id: `achievement-${slug}`,
            type: "ACHIEVEMENT_UNLOCKED",
            payload: {
              slug: achievement.slug,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
            },
          });
        }
      }

      const responsePayload: PurchaseItemResult = {
        ok: true,
        data: {
          item: {
            id: item.id,
            slug: item.slug,
            name: item.name,
            category: item.category,
            price: item.price,
          },
          character: {
            gold: updatedCharacter.gold,
            level: currentLevel,
            stateVersion: updatedCharacter.stateVersion,
          },
        },
        events,
        stateVersion: updatedCharacter.stateVersion,
      };

      await tx.mutationReceipt.create({
        data: {
          userId,
          idempotencyKey,
          operation: "SHOP_PURCHASE",
          requestHash: requestFingerprint,
          responsePayload: JSON.stringify(responsePayload),
          createdAt: serverDate,
        },
      });

      return responsePayload;
    });

    return result;
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && "message" in err) {
      const customErr = err as { code: string; message: string; status?: number };
      return {
        ok: false,
        error: {
          code: customErr.code,
          message: customErr.message,
          status: customErr.status || 400,
        },
      };
    }

    console.error("Unexpected error in purchaseItemTransaction:", err);
    return {
      ok: false,
      error: {
        code: "INTERNAL_TRANSACTION_ERROR",
        message: "An unexpected error occurred during purchase processing.",
        status: 500,
      },
    };
  }
}

export async function equipItem(params: {
  userId: string;
  itemId: string;
}) {
  const { userId, itemId } = params;

  const inventoryItem = await prisma.inventoryItem.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
    include: { shopItem: true },
  });

  if (!inventoryItem) {
    return {
      ok: false,
      error: {
        code: "ITEM_NOT_OWNED",
        message: "You do not own this item.",
        status: 403,
      },
    };
  }

  const { category, effectKey } = inventoryItem.shopItem;
  const validation = validateEquipment(category, effectKey);

  if (!validation.canEquip || !validation.slot) {
    return {
      ok: false,
      error: {
        code: "INVALID_EQUIPMENT_SLOT",
        message: validation.errorMessage || "Cannot equip this item.",
        status: 400,
      },
    };
  }

  const updatedCharacter = await prisma.character.update({
    where: { userId },
    data: {
      [validation.slot]: effectKey,
      stateVersion: { increment: 1 },
    },
  });

  return {
    ok: true,
    data: {
      slot: validation.slot,
      equippedValue: effectKey,
      character: updatedCharacter,
    },
  };
}
