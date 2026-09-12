import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { calculateLevelFromTotalXp, calculateAttributeProgression } from "@/server/game/progression";
import { getEffectiveDisplayStreak, getLocalDateString } from "@/server/game/streaks";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.character) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const todayStr = getLocalDateString(new Date(), user.activityTimezone || "UTC");
  const effectiveStreak = getEffectiveDisplayStreak(
    user.character.currentStreak,
    user.character.lastActivityDate,
    todayStr
  );

  const levelInfo = calculateLevelFromTotalXp(user.character.lifetimeXp);

  // Derive attribute progressions
  const attributes = {
    STRENGTH: calculateAttributeProgression(user.character.strengthXp),
    INTELLECT: calculateAttributeProgression(user.character.intellectXp),
    DISCIPLINE: calculateAttributeProgression(user.character.disciplineXp),
    VITALITY: calculateAttributeProgression(user.character.vitalityXp),
    CHARISMA: calculateAttributeProgression(user.character.charismaXp),
  };

  // Get user achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  });

  const totalCompletions = await prisma.completionLog.count({
    where: { userId: user.id },
  });

  return NextResponse.json({
    ok: true,
    data: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      activityTimezone: user.activityTimezone,
      displayTimezone: user.displayTimezone,
      timezoneLocked: user.timezoneLocked,
      soundEnabled: user.soundEnabled,
      motionReduced: user.motionReduced,
      character: {
        ...user.character,
        level: levelInfo.level,
        currentLevelXp: levelInfo.currentLevelXp,
        xpRequiredForNext: levelInfo.xpRequiredForNext,
        progressPercent: levelInfo.progressPercent,
        isMaxLevel: levelInfo.isMaxLevel,
        effectiveStreak,
      },
      attributes,
      totalCompletions,
      achievements: userAchievements.map((ua) => ({
        id: ua.achievement.id,
        slug: ua.achievement.slug,
        title: ua.achievement.title,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        category: ua.achievement.category,
        unlockedAt: ua.unlockedAt,
      })),
    },
  });
}

const patchMeSchema = z.object({
  displayName: z.string().trim().min(2).max(40).optional(),
  heroName: z.string().trim().min(2).max(40).optional(),
  activityTimezone: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  motionReduced: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = patchMeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const { displayName, heroName, activityTimezone, soundEnabled, motionReduced } = parsed.data;

    const userUpdate: Record<string, unknown> = {};
    if (displayName) userUpdate.displayName = displayName;
    if (typeof soundEnabled === "boolean") userUpdate.soundEnabled = soundEnabled;
    if (typeof motionReduced === "boolean") userUpdate.motionReduced = motionReduced;

    // Timezone update rule: only permit before first rewarded completion
    if (activityTimezone && activityTimezone !== user.activityTimezone) {
      if (user.timezoneLocked) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "TIMEZONE_LOCKED",
              message: "Your activity timezone is locked after your first rewarded quest to prevent streak tampering.",
            },
          },
          { status: 409 }
        );
      }
      userUpdate.activityTimezone = activityTimezone;
      userUpdate.displayTimezone = activityTimezone;
    }

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: userUpdate,
      });
    }

    if (heroName) {
      await prisma.character.update({
        where: { userId: user.id },
        data: { heroName },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Profile updated successfully.",
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to update profile." } },
      { status: 500 }
    );
  }
}
