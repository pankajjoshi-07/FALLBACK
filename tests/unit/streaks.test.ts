import { describe, it, expect } from "vitest";
import {
  evaluateStreakUpdate,
  getEffectiveDisplayStreak,
  calculateStreakMultiplierBps,
  calculateQuestReward,
  isConsecutiveDay,
  getLocalMondayDateString,
  generatePeriodKey,
} from "../../src/server/game/streaks";

describe("Streak and Timezone Engine", () => {
  describe("isConsecutiveDay", () => {
    it("recognizes standard consecutive calendar days", () => {
      expect(isConsecutiveDay("2026-09-11", "2026-09-12")).toBe(true);
      expect(isConsecutiveDay("2026-09-12", "2026-09-12")).toBe(false);
      expect(isConsecutiveDay("2026-09-10", "2026-09-12")).toBe(false);
    });

    it("handles month and leap year boundaries safely", () => {
      expect(isConsecutiveDay("2024-02-28", "2024-02-29")).toBe(true); // 2024 is leap year
      expect(isConsecutiveDay("2024-02-29", "2024-03-01")).toBe(true);
      expect(isConsecutiveDay("2026-02-28", "2026-03-01")).toBe(true); // 2026 is non-leap year
      expect(isConsecutiveDay("2026-12-31", "2027-01-01")).toBe(true); // Year boundary
    });
  });

  describe("evaluateStreakUpdate", () => {
    it("handles first activity day ever", () => {
      const res = evaluateStreakUpdate(0, 0, null, "2026-09-12");
      expect(res.newStreak).toBe(1);
      expect(res.newLongestStreak).toBe(1);
      expect(res.isFirstDay).toBe(true);
    });

    it("keeps streak unchanged for multiple completions on same calendar day", () => {
      const res = evaluateStreakUpdate(5, 7, "2026-09-12", "2026-09-12");
      expect(res.newStreak).toBe(5);
      expect(res.newLongestStreak).toBe(7);
      expect(res.isSameDay).toBe(true);
      expect(res.isConsecutive).toBe(false);
    });

    it("increments streak on consecutive day and updates longest streak", () => {
      const res = evaluateStreakUpdate(5, 5, "2026-09-11", "2026-09-12");
      expect(res.newStreak).toBe(6);
      expect(res.newLongestStreak).toBe(6);
      expect(res.isConsecutive).toBe(true);
    });

    it("resets streak to 1 on missed day without reducing longest streak", () => {
      const res = evaluateStreakUpdate(10, 15, "2026-09-08", "2026-09-12");
      expect(res.newStreak).toBe(1);
      expect(res.newLongestStreak).toBe(15); // Longest streak never decreases
      expect(res.isReset).toBe(true);
    });
  });

  describe("getEffectiveDisplayStreak", () => {
    it("returns 0 if no prior activity or streak <= 0", () => {
      expect(getEffectiveDisplayStreak(0, null, "2026-09-12")).toBe(0);
    });

    it("displays stored streak if active today", () => {
      expect(getEffectiveDisplayStreak(5, "2026-09-12", "2026-09-12")).toBe(5);
    });

    it("displays stored streak if active yesterday (grace before today's completion)", () => {
      expect(getEffectiveDisplayStreak(5, "2026-09-11", "2026-09-12")).toBe(5);
    });

    it("displays 0 if last active day is older than yesterday", () => {
      expect(getEffectiveDisplayStreak(5, "2026-09-10", "2026-09-12")).toBe(0);
    });
  });

  describe("calculateStreakMultiplierBps", () => {
    it("returns 1.00x (10000 bps) at streak 1", () => {
      expect(calculateStreakMultiplierBps(1)).toBe(10000);
      expect(calculateStreakMultiplierBps(0)).toBe(10000);
    });

    it("adds 200 bps (2%) per consecutive day beyond day 1", () => {
      expect(calculateStreakMultiplierBps(2)).toBe(10200); // 1.02x
      expect(calculateStreakMultiplierBps(3)).toBe(10400); // 1.04x
      expect(calculateStreakMultiplierBps(6)).toBe(11000); // 1.10x
    });

    it("caps bonus at 50% (15000 bps) at 25 bonus steps (streak 26)", () => {
      expect(calculateStreakMultiplierBps(26)).toBe(15000);
      expect(calculateStreakMultiplierBps(50)).toBe(15000);
      expect(calculateStreakMultiplierBps(100)).toBe(15000);
    });
  });

  describe("calculateQuestReward", () => {
    it("calculates exact rewards for Day 1 MEDIUM quest (50 XP, 30 Gold)", () => {
      const reward = calculateQuestReward(50, 1);
      expect(reward.xpAwarded).toBe(50);
      expect(reward.goldAwarded).toBe(30); // 50 * 60 / 100 = 30
      expect(reward.multiplierBps).toBe(10000);
    });

    it("applies streak multiplier with integer basis points", () => {
      // At streak 6 (1.10x multiplier), an EPIC quest (150 base XP)
      // xpAwarded = floor(150 * 11000 / 10000) = 165
      // goldAwarded = floor(165 * 60 / 100) = 99
      const reward = calculateQuestReward(150, 6);
      expect(reward.xpAwarded).toBe(165);
      expect(reward.goldAwarded).toBe(99);
    });
  });

  describe("Period keys and Monday anchor", () => {
    it("computes local Monday for weekly recurrence", () => {
      // 2026-09-12 is a Saturday
      const sat = new Date("2026-09-12T12:00:00Z");
      expect(getLocalMondayDateString(sat, "UTC")).toBe("2026-09-07");

      // 2026-09-13 is Sunday
      const sun = new Date("2026-09-13T12:00:00Z");
      expect(getLocalMondayDateString(sun, "UTC")).toBe("2026-09-07");

      // 2026-09-14 is Monday
      const mon = new Date("2026-09-14T12:00:00Z");
      expect(getLocalMondayDateString(mon, "UTC")).toBe("2026-09-14");
    });

    it("generates correct period keys for cadences", () => {
      const date = new Date("2026-09-12T12:00:00Z");
      expect(generatePeriodKey("ONCE", date, "UTC")).toBe("ONCE");
      expect(generatePeriodKey("DAILY", date, "UTC")).toBe("DAY:2026-09-12");
      expect(generatePeriodKey("WEEKLY", date, "UTC")).toBe("WEEK:2026-09-07");
    });
  });
});
