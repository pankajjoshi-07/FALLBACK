/**
 * Arcane Codex — Progression Game Engine
 * Authoritative mathematical progression curves, level derivations, and attribute growth.
 */

export const DIFFICULTY_XP: Record<string, number> = {
  TRIVIAL: 10,
  EASY: 25,
  MEDIUM: 50,
  HARD: 90,
  EPIC: 150,
};

export const MAX_LEVEL = 100;

/**
 * Exact non-linear XP requirement formula:
 * For current level L >= 1, let n = L - 1:
 * xpRequiredToAdvance(L) = 100 + 50*n + 25*n*n
 *
 * Examples:
 * Level 1 -> 2: n=0 => 100 XP
 * Level 2 -> 3: n=1 => 175 XP
 * Level 3 -> 4: n=2 => 300 XP
 * Level 4 -> 5: n=3 => 475 XP
 * Level 5 -> 6: n=4 => 700 XP
 */
export function xpRequiredToAdvance(level: number): number {
  if (level < 1) return 100;
  const n = level - 1;
  return 100 + 50 * n + 25 * n * n;
}

/**
 * Precomputed cumulative thresholds for levels 1 through MAX_LEVEL
 */
const CUMULATIVE_XP_THRESHOLDS: number[] = [0]; // index 1 is level 1 (0 XP)
(() => {
  let runningTotal = 0;
  for (let l = 1; l <= MAX_LEVEL; l++) {
    CUMULATIVE_XP_THRESHOLDS[l] = runningTotal;
    runningTotal += xpRequiredToAdvance(l);
  }
})();

export function getCumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return CUMULATIVE_XP_THRESHOLDS[MAX_LEVEL];
  return CUMULATIVE_XP_THRESHOLDS[level];
}

export interface LevelProgression {
  level: number;
  currentLevelXp: number;
  xpRequiredForNext: number;
  progressPercent: number;
  isMaxLevel: boolean;
  totalXp: number;
}

/**
 * Derives current character level and progress from lifetime total XP.
 * Handles zero XP, exact boundary transitions, multiple level-ups, and Level 100 cap.
 */
export function calculateLevelFromTotalXp(totalXp: number): LevelProgression {
  const safeTotalXp = Math.max(0, Math.floor(totalXp || 0));

  let currentLevel = 1;
  for (let l = 1; l < MAX_LEVEL; l++) {
    const nextThreshold = CUMULATIVE_XP_THRESHOLDS[l + 1];
    if (safeTotalXp >= nextThreshold) {
      currentLevel = l + 1;
    } else {
      break;
    }
  }

  if (currentLevel >= MAX_LEVEL) {
    return {
      level: MAX_LEVEL,
      currentLevelXp: 0,
      xpRequiredForNext: 0,
      progressPercent: 100,
      isMaxLevel: true,
      totalXp: safeTotalXp,
    };
  }

  const baseThreshold = CUMULATIVE_XP_THRESHOLDS[currentLevel];
  const reqForNext = xpRequiredToAdvance(currentLevel);
  const currentLevelXp = safeTotalXp - baseThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / reqForNext) * 100)));

  return {
    level: currentLevel,
    currentLevelXp,
    xpRequiredForNext: reqForNext,
    progressPercent,
    isMaxLevel: false,
    totalXp: safeTotalXp,
  };
}

export interface LevelUpEvent {
  fromLevel: number;
  toLevel: number;
  levelsGained: number;
}

export function detectLevelUp(oldTotalXp: number, newTotalXp: number): LevelUpEvent | null {
  const oldState = calculateLevelFromTotalXp(oldTotalXp);
  const newState = calculateLevelFromTotalXp(newTotalXp);

  if (newState.level > oldState.level) {
    return {
      fromLevel: oldState.level,
      toLevel: newState.level,
      levelsGained: newState.level - oldState.level,
    };
  }
  return null;
}

export interface AttributeProgression {
  level: number;
  currentXp: number;
  currentLevelFloorXp: number;
  nextLevelThresholdXp: number;
  progressPercent: number;
}

/**
 * Attribute Progression:
 * attributeLevel = 1 + floor(sqrt(attributeXp / 100))
 *
 * Level thresholds:
 * Level 1: 0 - 99 XP
 * Level 2: 100 - 399 XP
 * Level 3: 400 - 899 XP
 * Level 4: 900 - 1599 XP
 * Level 5: 1600 - 2499 XP
 */
export function calculateAttributeProgression(attributeXp: number): AttributeProgression {
  const safeXp = Math.max(0, Math.floor(attributeXp || 0));
  const level = 1 + Math.floor(Math.sqrt(safeXp / 100));

  const k = level - 1;
  const floorXp = k * k * 100;
  const nextThreshold = level * level * 100;
  const span = nextThreshold - floorXp;
  const progressWithinLevel = safeXp - floorXp;
  const progressPercent = span > 0 ? Math.min(100, Math.max(0, Math.round((progressWithinLevel / span) * 100))) : 0;

  return {
    level,
    currentXp: safeXp,
    currentLevelFloorXp: floorXp,
    nextLevelThresholdXp: nextThreshold,
    progressPercent,
  };
}
