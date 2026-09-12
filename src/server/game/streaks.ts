/**
 * Arcane Codex — Streak & Timezone Engine
 * Timezone-aware date calculations, period key derivations, and streak bonus arithmetic.
 */

/**
 * Parses "YYYY-MM-DD" into year, month, day integers.
 */
export function parseLocalDate(dateString: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
  };
}

/**
 * Returns true if dateA is strictly 1 calendar day before dateB.
 * Uses UTC Date objects strictly anchored at 12:00:00 to avoid DST hour skew.
 */
export function isConsecutiveDay(dateAStr: string, dateBStr: string): boolean {
  const a = parseLocalDate(dateAStr);
  const b = parseLocalDate(dateBStr);
  if (!a || !b) return false;

  const utcDateA = Date.UTC(a.year, a.month - 1, a.day, 12, 0, 0);
  const utcDateB = Date.UTC(b.year, b.month - 1, b.day, 12, 0, 0);

  const diffMs = utcDateB - utcDateA;
  const oneDayMs = 24 * 60 * 60 * 1000;

  return diffMs === oneDayMs;
}

/**
 * Formats a Date object into "YYYY-MM-DD" local to the specified IANA time zone.
 */
export function getLocalDateString(date: Date, timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date); // en-CA produces YYYY-MM-DD
  } catch {
    // Fallback to UTC if timezone is invalid
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Calculates the local Monday date string "YYYY-MM-DD" for the week containing the given date.
 */
export function getLocalMondayDateString(date: Date, timeZone: string): string {
  const localStr = getLocalDateString(date, timeZone);
  const parts = parseLocalDate(localStr);
  if (!parts) return localStr;

  // Anchor in UTC at noon
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0));
  const dayOfWeek = d.getUTCDay(); // 0 is Sunday, 1 is Monday, ... 6 is Saturday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setUTCDate(d.getUTCDate() + diffToMonday);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates an authoritative period key for quest recurrence checks.
 */
export function generatePeriodKey(
  cadence: "ONCE" | "DAILY" | "WEEKLY" | string,
  serverDate: Date,
  activityTimezone: string
): string {
  if (cadence === "ONCE") {
    return "ONCE";
  }
  if (cadence === "WEEKLY") {
    const monday = getLocalMondayDateString(serverDate, activityTimezone);
    return `WEEK:${monday}`;
  }
  // Default DAILY
  const todayStr = getLocalDateString(serverDate, activityTimezone);
  return `DAY:${todayStr}`;
}

export interface StreakEvaluation {
  newStreak: number;
  newLongestStreak: number;
  isFirstDay: boolean;
  isSameDay: boolean;
  isConsecutive: boolean;
  isReset: boolean;
}

/**
 * Evaluates streak progression when recording a new quest completion.
 */
export function evaluateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null,
  todayLocalDate: string
): StreakEvaluation {
  // Case 1: First activity ever
  if (!lastActivityDate) {
    return {
      newStreak: 1,
      newLongestStreak: Math.max(longestStreak, 1),
      isFirstDay: true,
      isSameDay: false,
      isConsecutive: false,
      isReset: false,
    };
  }

  // Case 2: Same calendar day activity
  if (lastActivityDate === todayLocalDate) {
    return {
      newStreak: Math.max(1, currentStreak),
      newLongestStreak: longestStreak,
      isFirstDay: false,
      isSameDay: true,
      isConsecutive: false,
      isReset: false,
    };
  }

  // Case 3: Consecutive calendar day
  if (isConsecutiveDay(lastActivityDate, todayLocalDate)) {
    const incremented = currentStreak + 1;
    return {
      newStreak: incremented,
      newLongestStreak: Math.max(longestStreak, incremented),
      isFirstDay: false,
      isSameDay: false,
      isConsecutive: true,
      isReset: false,
    };
  }

  // Case 4: Missed at least one day -> reset to 1
  return {
    newStreak: 1,
    newLongestStreak: longestStreak,
    isFirstDay: false,
    isSameDay: false,
    isConsecutive: false,
    isReset: true,
  };
}

/**
 * Returns the effective displayed streak for the HUD.
 * If the user has not been active today and was not active yesterday, display streak is 0.
 */
export function getEffectiveDisplayStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  todayLocalDate: string
): number {
  if (!lastActivityDate || currentStreak <= 0) {
    return 0;
  }
  if (lastActivityDate === todayLocalDate) {
    return currentStreak;
  }
  if (isConsecutiveDay(lastActivityDate, todayLocalDate)) {
    return currentStreak;
  }
  return 0;
}

/**
 * Streak multiplier formula in integer basis points:
 * bonusSteps = min(max(streak - 1, 0), 25)
 * multiplierBps = 10000 + 200 * bonusSteps  (1.00x at streak 1 up to 1.50x at streak 26+)
 */
export function calculateStreakMultiplierBps(streak: number): number {
  const safeStreak = Math.max(0, streak || 0);
  const bonusSteps = Math.min(Math.max(safeStreak - 1, 0), 25);
  return 10000 + 200 * bonusSteps;
}

export interface RewardCalculation {
  xpAwarded: number;
  goldAwarded: number;
  multiplierBps: number;
  multiplierDecimal: number;
}

/**
 * Authoritative reward calculation:
 * xpAwarded = floor(baseXp * multiplierBps / 10000)
 * goldAwarded = floor(xpAwarded * 60 / 100)
 */
export function calculateQuestReward(baseXp: number, streak: number): RewardCalculation {
  const safeBaseXp = Math.max(0, Math.floor(baseXp || 0));
  const multiplierBps = calculateStreakMultiplierBps(streak);
  const xpAwarded = Math.floor((safeBaseXp * multiplierBps) / 10000);
  const goldAwarded = Math.floor((xpAwarded * 60) / 100);

  return {
    xpAwarded,
    goldAwarded,
    multiplierBps,
    multiplierDecimal: multiplierBps / 10000,
  };
}
