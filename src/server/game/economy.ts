/**
 * Arcane Codex — Economy & Cosmetics Engine
 * Validation and business rules for catalog items, gold transactions, and equipment slots.
 */

export type CosmeticCategory = "THEME" | "AVATAR" | "TITLE" | "FRAME" | "BADGE";

export const ALLOWED_THEME_KEYS = ["theme-midnight", "theme-crimson", "theme-emerald"] as const;
export type AllowedThemeKey = (typeof ALLOWED_THEME_KEYS)[number];

export const ALLOWED_AVATAR_KEYS = [
  "avatar-warrior",
  "avatar-scholar",
  "avatar-monk",
  "avatar-bard",
  "avatar-artisan",
] as const;
export type AllowedAvatarKey = (typeof ALLOWED_AVATAR_KEYS)[number];

export interface PurchaseValidationResult {
  canPurchase: boolean;
  errorCode?: "INSUFFICIENT_GOLD" | "LEVEL_TOO_LOW" | "ALREADY_OWNED" | "ITEM_INACTIVE" | "INVALID_ITEM";
  errorMessage?: string;
}

export function validatePurchase(
  item: { price: number; levelRequirement: number; active: boolean },
  character: { gold: number; level: number },
  alreadyOwned: boolean
): PurchaseValidationResult {
  if (!item || !item.active) {
    return {
      canPurchase: false,
      errorCode: "ITEM_INACTIVE",
      errorMessage: "This relic is not currently available for purchase.",
    };
  }

  if (alreadyOwned) {
    return {
      canPurchase: false,
      errorCode: "ALREADY_OWNED",
      errorMessage: "You already possess this permanent relic in your inventory.",
    };
  }

  if (character.level < item.levelRequirement) {
    return {
      canPurchase: false,
      errorCode: "LEVEL_TOO_LOW",
      errorMessage: `Requires Level ${item.levelRequirement}. Current Level is ${character.level}.`,
    };
  }

  if (character.gold < item.price) {
    const deficit = item.price - character.gold;
    return {
      canPurchase: false,
      errorCode: "INSUFFICIENT_GOLD",
      errorMessage: `You require ${deficit} more Gold to purchase this item.`,
    };
  }

  return { canPurchase: true };
}

export interface EquipValidationResult {
  canEquip: boolean;
  slot?: "equippedTheme" | "equippedAvatar" | "equippedTitle" | "equippedFrame";
  errorMessage?: string;
}

export function validateEquipment(
  category: string,
  effectKey: string
): EquipValidationResult {
  switch (category) {
    case "THEME":
      if (!ALLOWED_THEME_KEYS.includes(effectKey as AllowedThemeKey)) {
        return { canEquip: false, errorMessage: "Unknown or unauthorized theme." };
      }
      return { canEquip: true, slot: "equippedTheme" };

    case "AVATAR":
      if (!ALLOWED_AVATAR_KEYS.includes(effectKey as AllowedAvatarKey)) {
        return { canEquip: false, errorMessage: "Unknown or unauthorized avatar." };
      }
      return { canEquip: true, slot: "equippedAvatar" };

    case "TITLE":
      return { canEquip: true, slot: "equippedTitle" };

    case "FRAME":
      return { canEquip: true, slot: "equippedFrame" };

    default:
      return { canEquip: false, errorMessage: "This item cannot be equipped to a cosmetic slot." };
  }
}
