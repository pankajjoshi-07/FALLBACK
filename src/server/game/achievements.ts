/**
 * Arcane Codex — Achievement Verification Engine
 * Determines newly unlocked achievements based on character state, quest milestones, and economy activity.
 */

export interface AchievementCriteriaInput {
  totalCompletedQuests: number;
  currentStreak: number;
  level: number;
  intellectXp: number;
  purchasedItemsCount: number;
  bossDefeated: boolean;
  unlockedAchievementSlugs: Set<string>;
}

export function evaluateNewAchievements(input: AchievementCriteriaInput): string[] {
  const newSlugs: string[] = [];

  const check = (slug: string, condition: boolean) => {
    if (condition && !input.unlockedAchievementSlugs.has(slug)) {
      newSlugs.push(slug);
    }
  };

  // Quest count milestones
  check("first-quest", input.totalCompletedQuests >= 1);
  check("quests-10", input.totalCompletedQuests >= 10);
  check("quests-50", input.totalCompletedQuests >= 50);

  // Streak milestones
  check("streak-7", input.currentStreak >= 7);
  check("streak-30", input.currentStreak >= 30);

  // Level milestones
  check("level-5", input.level >= 5);

  // Attribute milestones
  check("intellect-1000", input.intellectXp >= 1000);

  // Economy milestones
  check("first-purchase", input.purchasedItemsCount >= 1);

  // Boss milestones
  check("boss-slayer", input.bossDefeated);

  return newSlugs;
}
