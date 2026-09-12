import { describe, it, expect } from "vitest";
import {
  DIFFICULTY_XP,
  xpRequiredToAdvance,
  calculateLevelFromTotalXp,
  detectLevelUp,
  calculateAttributeProgression,
  MAX_LEVEL,
} from "../../src/server/game/progression";

describe("Progression Game Engine", () => {
  describe("Difficulty XP mapping", () => {
    it("matches exact competition specification", () => {
      expect(DIFFICULTY_XP.TRIVIAL).toBe(10);
      expect(DIFFICULTY_XP.EASY).toBe(25);
      expect(DIFFICULTY_XP.MEDIUM).toBe(50);
      expect(DIFFICULTY_XP.HARD).toBe(90);
      expect(DIFFICULTY_XP.EPIC).toBe(150);
    });
  });

  describe("Non-linear level curve: xpRequiredToAdvance(L) = 100 + 50*n + 25*n*n", () => {
    it("generates exact required XP for levels 1 through 6", () => {
      // Level 1 -> 2: n=0 => 100 + 0 + 0 = 100
      expect(xpRequiredToAdvance(1)).toBe(100);
      // Level 2 -> 3: n=1 => 100 + 50(1) + 25(1) = 175
      expect(xpRequiredToAdvance(2)).toBe(175);
      // Level 3 -> 4: n=2 => 100 + 50(2) + 25(4) = 300
      expect(xpRequiredToAdvance(3)).toBe(300);
      // Level 4 -> 5: n=3 => 100 + 50(3) + 25(9) = 475
      expect(xpRequiredToAdvance(4)).toBe(475);
      // Level 5 -> 6: n=4 => 100 + 50(4) + 25(16) = 700
      expect(xpRequiredToAdvance(5)).toBe(700);
    });
  });

  describe("calculateLevelFromTotalXp", () => {
    it("handles fresh hero with 0 XP", () => {
      const p = calculateLevelFromTotalXp(0);
      expect(p.level).toBe(1);
      expect(p.currentLevelXp).toBe(0);
      expect(p.xpRequiredForNext).toBe(100);
      expect(p.progressPercent).toBe(0);
      expect(p.isMaxLevel).toBe(false);
      expect(p.totalXp).toBe(0);
    });

    it("handles exact level boundaries", () => {
      // 100 XP is exact boundary for Level 2
      const p100 = calculateLevelFromTotalXp(100);
      expect(p100.level).toBe(2);
      expect(p100.currentLevelXp).toBe(0);
      expect(p100.xpRequiredForNext).toBe(175);
      expect(p100.progressPercent).toBe(0);

      // 99 XP is Level 1 with 99/100 XP (99%)
      const p99 = calculateLevelFromTotalXp(99);
      expect(p99.level).toBe(1);
      expect(p99.currentLevelXp).toBe(99);
      expect(p99.xpRequiredForNext).toBe(100);
      expect(p99.progressPercent).toBe(99);
    });

    it("handles deterministic demo path: 3 MEDIUM quests (150 total XP)", () => {
      const p = calculateLevelFromTotalXp(150);
      expect(p.level).toBe(2);
      expect(p.currentLevelXp).toBe(50);
      expect(p.xpRequiredForNext).toBe(175);
      expect(p.progressPercent).toBe(29); // 50 / 175 = 28.57% -> 29%
    });

    it("handles multiple level-ups from a single large reward", () => {
      // Starting from 0 XP, receiving 600 XP (e.g. boss kill or chain)
      // Level 1: 100, Level 2: 175, Level 3: 300 => Cumulative 575 reaches Level 4
      const p = calculateLevelFromTotalXp(600);
      expect(p.level).toBe(4);
      expect(p.currentLevelXp).toBe(25); // 600 - 575 = 25
      expect(p.xpRequiredForNext).toBe(475);
    });

    it("handles level cap at Level 100 without overflow", () => {
      const pMax = calculateLevelFromTotalXp(100_000_000);
      expect(pMax.level).toBe(MAX_LEVEL);
      expect(pMax.isMaxLevel).toBe(true);
      expect(pMax.progressPercent).toBe(100);
      expect(pMax.totalXp).toBe(100_000_000);
    });
  });

  describe("detectLevelUp", () => {
    it("returns null when level does not change", () => {
      expect(detectLevelUp(0, 50)).toBeNull();
      expect(detectLevelUp(100, 150)).toBeNull();
    });

    it("returns level up event for single level increment", () => {
      const event = detectLevelUp(50, 150);
      expect(event).toEqual({
        fromLevel: 1,
        toLevel: 2,
        levelsGained: 1,
      });
    });

    it("returns multi-level up event correctly", () => {
      const event = detectLevelUp(50, 600);
      expect(event).toEqual({
        fromLevel: 1,
        toLevel: 4,
        levelsGained: 3,
      });
    });
  });

  describe("Attribute Progression: 1 + floor(sqrt(attributeXp / 100))", () => {
    it("calculates accurate attribute levels and thresholds", () => {
      // 0 XP -> Level 1 (floor 0, next 100)
      expect(calculateAttributeProgression(0).level).toBe(1);
      expect(calculateAttributeProgression(0).nextLevelThresholdXp).toBe(100);

      // 99 XP -> Level 1
      expect(calculateAttributeProgression(99).level).toBe(1);

      // 100 XP -> Level 2 (sqrt(1) = 1 + 1 = 2, next 400)
      expect(calculateAttributeProgression(100).level).toBe(2);
      expect(calculateAttributeProgression(100).nextLevelThresholdXp).toBe(400);

      // 399 XP -> Level 2
      expect(calculateAttributeProgression(399).level).toBe(2);

      // 400 XP -> Level 3 (sqrt(4) = 2 + 1 = 3, next 900)
      expect(calculateAttributeProgression(400).level).toBe(3);
      expect(calculateAttributeProgression(400).nextLevelThresholdXp).toBe(900);

      // 1000 Intellect XP -> Level 4 (sqrt(10) = 3 + 1 = 4)
      expect(calculateAttributeProgression(1000).level).toBe(4);
    });
  });
});
