import { describe, it, expect } from "vitest";
import { validatePurchase, validateEquipment } from "../../src/server/game/economy";
import { evaluateNewAchievements } from "../../src/server/game/achievements";

describe("Economy Engine", () => {
  const crimsonTheme = {
    price: 90,
    levelRequirement: 2,
    active: true,
  };

  it("permits purchase when level and gold criteria are met", () => {
    const character = { gold: 90, level: 2 };
    const result = validatePurchase(crimsonTheme, character, false);
    expect(result.canPurchase).toBe(true);
  });

  it("rejects purchase when gold is insufficient", () => {
    const character = { gold: 80, level: 2 };
    const result = validatePurchase(crimsonTheme, character, false);
    expect(result.canPurchase).toBe(false);
    expect(result.errorCode).toBe("INSUFFICIENT_GOLD");
    expect(result.errorMessage).toContain("10 more Gold");
  });

  it("rejects purchase when character level is below requirement", () => {
    const character = { gold: 100, level: 1 };
    const result = validatePurchase(crimsonTheme, character, false);
    expect(result.canPurchase).toBe(false);
    expect(result.errorCode).toBe("LEVEL_TOO_LOW");
  });

  it("rejects duplicate purchase of already owned permanent relic", () => {
    const character = { gold: 200, level: 5 };
    const result = validatePurchase(crimsonTheme, character, true);
    expect(result.canPurchase).toBe(false);
    expect(result.errorCode).toBe("ALREADY_OWNED");
  });

  it("validates cosmetic equipment slots accurately", () => {
    expect(validateEquipment("THEME", "theme-crimson")).toEqual({
      canEquip: true,
      slot: "equippedTheme",
    });
    expect(validateEquipment("THEME", "unauthorized-malicious-css")).toEqual({
      canEquip: false,
      errorMessage: "Unknown or unauthorized theme.",
    });
    expect(validateEquipment("AVATAR", "avatar-scholar")).toEqual({
      canEquip: true,
      slot: "equippedAvatar",
    });
    expect(validateEquipment("TITLE", "The Focused")).toEqual({
      canEquip: true,
      slot: "equippedTitle",
    });
  });
});

describe("Achievements Engine", () => {
  it("detects first quest achievement", () => {
    const newAchievements = evaluateNewAchievements({
      totalCompletedQuests: 1,
      currentStreak: 1,
      level: 1,
      intellectXp: 50,
      purchasedItemsCount: 0,
      bossDefeated: false,
      unlockedAchievementSlugs: new Set(),
    });
    expect(newAchievements).toContain("first-quest");
    expect(newAchievements).not.toContain("quests-10");
  });

  it("does not award already unlocked achievements", () => {
    const newAchievements = evaluateNewAchievements({
      totalCompletedQuests: 10,
      currentStreak: 7,
      level: 5,
      intellectXp: 1000,
      purchasedItemsCount: 1,
      bossDefeated: false,
      unlockedAchievementSlugs: new Set(["first-quest", "quests-10", "streak-7"]),
    });
    expect(newAchievements).not.toContain("first-quest");
    expect(newAchievements).not.toContain("quests-10");
    expect(newAchievements).not.toContain("streak-7");
    expect(newAchievements).toContain("level-5");
    expect(newAchievements).toContain("intellect-1000");
    expect(newAchievements).toContain("first-purchase");
  });
});
