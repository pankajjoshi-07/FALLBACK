import { prisma } from "../db/prisma";
import { DIFFICULTY_XP, calculateLevelFromTotalXp, detectLevelUp } from "../game/progression";
import {
  evaluateStreakUpdate,
  getLocalDateString,
  generatePeriodKey,
  calculateQuestReward,
  getLocalMondayDateString,
} from "../game/streaks";
import { evaluateNewAchievements } from "../game/achievements";
import crypto from "crypto";

export interface CompleteQuestResult {
  ok: boolean;
  isReplay?: boolean;
  data?: {
    quest: {
      id: string;
      title: string;
      difficulty: string;
      attribute: string;
      cadence: string;
    };
    character: {
      heroName: string;
      level: number;
      lifetimeXp: number;
      currentLevelXp: number;
      xpRequiredForNext: number;
      progressPercent: number;
      gold: number;
      currentStreak: number;
      longestStreak: number;
      strengthXp: number;
      intellectXp: number;
      disciplineXp: number;
      vitalityXp: number;
      charismaXp: number;
      stateVersion: number;
    };
    reward: {
      xpAwarded: number;
      goldAwarded: number;
      multiplierBps: number;
      multiplierDecimal: number;
    };
  };
  events?: Array<{
    id: string;
    type: "LEVEL_UP" | "ACHIEVEMENT_UNLOCKED" | "BOSS_DAMAGED" | "BOSS_DEFEATED";
    payload: Record<string, unknown>;
  }>;
  stateVersion?: number;
  error?: {
    code: string;
    message: string;
    status: number;
  };
}

/**
 * Authoritative transactional completion engine.
 */
export async function completeQuestTransaction(params: {
  userId: string;
  questId: string;
  idempotencyKey?: string;
  serverDate?: Date;
}): Promise<CompleteQuestResult> {
  const { userId, questId } = params;
  const serverDate = params.serverDate || new Date();
  const idempotencyKey = params.idempotencyKey || `auto-${crypto.randomUUID()}`;

  // Request fingerprint for idempotency validation
  const requestFingerprint = crypto
    .createHash("sha256")
    .update(`complete:${userId}:${questId}`)
    .digest("hex");

  // Step 1: Check existing idempotency receipt
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
      // Safe idempotent replay
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

  // Step 2: Execute atomic transaction
  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Fetch user and locked character state
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { character: true },
      });

      if (!user || !user.character) {
        throw { code: "USER_NOT_FOUND", message: "User or character not found.", status: 404 };
      }

      // 2. Fetch quest with ownership verification
      const quest = await tx.quest.findFirst({
        where: {
          id: questId,
          userId,
          archivedAt: null,
        },
      });

      if (!quest) {
        throw { code: "QUEST_NOT_FOUND", message: "Quest not found or archived.", status: 404 };
      }

      // 3. Compute period key and local date using authoritative server date & activity timezone
      const activityTimezone = user.activityTimezone || "UTC";
      const localTodayStr = getLocalDateString(serverDate, activityTimezone);
      const periodKey = generatePeriodKey(quest.cadence, serverDate, activityTimezone);

      // 4. Verify occurrence availability
      const existingCompletions = await tx.completionLog.findMany({
        where: {
          userId,
          questId,
          periodKey,
        },
        orderBy: { occurrenceSlot: "asc" },
      });

      const maxAllowed = quest.cadence === "WEEKLY" ? Math.max(1, quest.weeklyTarget) : 1;

      if (existingCompletions.length >= maxAllowed) {
        throw {
          code: "OCCURRENCE_ALREADY_CLAIMED",
          message:
            quest.cadence === "ONCE"
              ? "This one-time quest has already been completed."
              : quest.cadence === "DAILY"
              ? "This daily ritual has already been completed today."
              : `Weekly target of ${maxAllowed} completions already fulfilled for this week.`,
          status: 409,
        };
      }

      const nextOccurrenceSlot = existingCompletions.length + 1;

      // 5. Calculate streak & rewards
      const streakEval = evaluateStreakUpdate(
        user.character.currentStreak,
        user.character.longestStreak,
        user.character.lastActivityDate,
        localTodayStr
      );

      const baseXp = DIFFICULTY_XP[quest.difficulty] || 25;
      const reward = calculateQuestReward(baseXp, streakEval.newStreak);

      const oldTotalXp = user.character.lifetimeXp;
      const newTotalXp = oldTotalXp + reward.xpAwarded;
      const newGold = user.character.gold + reward.goldAwarded;

      // Level progression
      const oldProgression = calculateLevelFromTotalXp(oldTotalXp);
      const newProgression = calculateLevelFromTotalXp(newTotalXp);
      const levelUpEvent = detectLevelUp(oldTotalXp, newTotalXp);

      // Attribute growth
      const attrKey = `${quest.attribute.toLowerCase()}Xp` as
        | "strengthXp"
        | "intellectXp"
        | "disciplineXp"
        | "vitalityXp"
        | "charismaXp";

      const currentAttrXp = user.character[attrKey] || 0;
      const newAttrXp = currentAttrXp + reward.xpAwarded;

      // 6. Insert immutable completion record
      const completionLog = await tx.completionLog.create({
        data: {
          userId,
          questId,
          questTitle: quest.title,
          difficulty: quest.difficulty,
          attribute: quest.attribute,
          periodKey,
          occurrenceSlot: nextOccurrenceSlot,
          xpAwarded: reward.xpAwarded,
          goldAwarded: reward.goldAwarded,
          streakSnapshot: streakEval.newStreak,
          multiplierBps: reward.multiplierBps,
          localActivityDate: localTodayStr,
          timezone: activityTimezone,
          completedAt: serverDate,
        },
      });

      // 7. Update activity-day summary
      await tx.activityDay.upsert({
        where: {
          userId_localDate: {
            userId,
            localDate: localTodayStr,
          },
        },
        update: {
          completionCount: { increment: 1 },
          xpEarned: { increment: reward.xpAwarded },
          goldEarned: { increment: reward.goldAwarded },
        },
        create: {
          userId,
          localDate: localTodayStr,
          completionCount: 1,
          xpEarned: reward.xpAwarded,
          goldEarned: reward.goldAwarded,
        },
      });

      // 8. Insert gold ledger credit
      await tx.goldLedger.create({
        data: {
          userId,
          amount: reward.goldAwarded,
          balanceAfter: newGold,
          sourceType: "QUEST_COMPLETION",
          sourceId: completionLog.id,
          description: `Reward for quest: ${quest.title}`,
          createdAt: serverDate,
        },
      });

      // 9. Update character totals & lock activity timezone
      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          lifetimeXp: newTotalXp,
          gold: newGold,
          currentStreak: streakEval.newStreak,
          longestStreak: streakEval.newLongestStreak,
          lastActivityDate: localTodayStr,
          [attrKey]: newAttrXp,
          stateVersion: { increment: 1 },
        },
      });

      if (!user.timezoneLocked) {
        await tx.user.update({
          where: { id: userId },
          data: { timezoneLocked: true },
        });
      }

      // 10. Check weekly boss instance damage
      const weekMonday = getLocalMondayDateString(serverDate, activityTimezone);
      const weekPeriod = `WEEK:${weekMonday}`;

      let bossEvent: CompleteQuestResult["events"] = [];

      let boss = await tx.userBossInstance.findUnique({
        where: {
          userId_weekPeriod: {
            userId,
            weekPeriod,
          },
        },
      });

      if (!boss) {
        boss = await tx.userBossInstance.create({
          data: {
            userId,
            weekPeriod,
            name: "Procrastinus, Keeper of Delay",
            maxHp: 1500,
            currentHp: 1500,
          },
        });
      }

      if (!boss.isDefeated) {
        const damage = baseXp; // Base XP determines boss damage
        const newHp = Math.max(0, boss.currentHp - damage);
        const defeated = newHp === 0;

        await tx.bossDamage.create({
          data: {
            bossInstanceId: boss.id,
            questCompletionId: completionLog.id,
            damage,
            dealtAt: serverDate,
          },
        });

        const updatedBoss = await tx.userBossInstance.update({
          where: { id: boss.id },
          data: {
            currentHp: newHp,
            isDefeated: defeated,
          },
        });

        bossEvent.push({
          id: `boss-damage-${completionLog.id}`,
          type: "BOSS_DAMAGED",
          payload: {
            damage,
            bossHpRemaining: newHp,
            bossMaxHp: boss.maxHp,
          },
        });

        if (defeated && !boss.isDefeated) {
          bossEvent.push({
            id: `boss-defeat-${boss.id}`,
            type: "BOSS_DEFEATED",
            payload: {
              bossName: boss.name,
            },
          });
        }
      }

      // 11. Check and award achievements
      const totalCompletedQuests = await tx.completionLog.count({ where: { userId } });
      const inventoryCount = await tx.inventoryItem.count({ where: { userId } });
      const existingUserAchievements = await tx.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      });
      const unlockedSlugs = new Set(existingUserAchievements.map((ua) => ua.achievement.slug));

      const newlyEarnedSlugs = evaluateNewAchievements({
        totalCompletedQuests,
        currentStreak: streakEval.newStreak,
        level: newProgression.level,
        intellectXp: attrKey === "intellectXp" ? newAttrXp : user.character.intellectXp,
        purchasedItemsCount: inventoryCount,
        bossDefeated: boss?.isDefeated ?? false,
        unlockedAchievementSlugs: unlockedSlugs,
      });

      const achievementEvents: CompleteQuestResult["events"] = [];

      for (const slug of newlyEarnedSlugs) {
        const achievement = await tx.achievement.findUnique({ where: { slug } });
        if (achievement) {
          await tx.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              unlockedAt: serverDate,
            },
          });

          achievementEvents.push({
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

      // Consolidate emitted events
      const events: CompleteQuestResult["events"] = [];
      if (levelUpEvent) {
        events.push({
          id: `level-up-${newProgression.level}`,
          type: "LEVEL_UP",
          payload: {
            fromLevel: levelUpEvent.fromLevel,
            toLevel: levelUpEvent.toLevel,
            levelsGained: levelUpEvent.levelsGained,
          },
        });
      }
      events.push(...bossEvent);
      events.push(...achievementEvents);

      const responsePayload: CompleteQuestResult = {
        ok: true,
        data: {
          quest: {
            id: quest.id,
            title: quest.title,
            difficulty: quest.difficulty,
            attribute: quest.attribute,
            cadence: quest.cadence,
          },
          character: {
            heroName: updatedCharacter.heroName,
            level: newProgression.level,
            lifetimeXp: updatedCharacter.lifetimeXp,
            currentLevelXp: newProgression.currentLevelXp,
            xpRequiredForNext: newProgression.xpRequiredForNext,
            progressPercent: newProgression.progressPercent,
            gold: updatedCharacter.gold,
            currentStreak: updatedCharacter.currentStreak,
            longestStreak: updatedCharacter.longestStreak,
            strengthXp: updatedCharacter.strengthXp,
            intellectXp: updatedCharacter.intellectXp,
            disciplineXp: updatedCharacter.disciplineXp,
            vitalityXp: updatedCharacter.vitalityXp,
            charismaXp: updatedCharacter.charismaXp,
            stateVersion: updatedCharacter.stateVersion,
          },
          reward,
        },
        events,
        stateVersion: updatedCharacter.stateVersion,
      };

      // 12. Save mutation receipt for safe idempotency
      await tx.mutationReceipt.create({
        data: {
          userId,
          idempotencyKey,
          operation: "QUEST_COMPLETION",
          requestHash: requestFingerprint,
          responsePayload: JSON.stringify(responsePayload),
          createdAt: serverDate,
        },
      });

      return responsePayload;
    });

    return transactionResult;
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

    console.error("Unexpected error in completeQuestTransaction:", err);
    return {
      ok: false,
      error: {
        code: "INTERNAL_TRANSACTION_ERROR",
        message: "An unexpected error occurred during reward calculation.",
        status: 500,
      },
    };
  }
}
