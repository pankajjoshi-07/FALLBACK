import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { getLocalMondayDateString } from "@/server/game/streaks";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const now = new Date();
  const timezone = user.activityTimezone || "UTC";
  const mondayStr = getLocalMondayDateString(now, timezone);
  const weekPeriod = `WEEK:${mondayStr}`;

  let boss = await prisma.userBossInstance.findUnique({
    where: {
      userId_weekPeriod: {
        userId: user.id,
        weekPeriod,
      },
    },
    include: {
      damageLogs: {
        orderBy: { dealtAt: "desc" },
        take: 10,
      },
    },
  });

  if (!boss) {
    boss = await prisma.userBossInstance.create({
      data: {
        userId: user.id,
        weekPeriod,
        name: "Procrastinus, Keeper of Delay",
        maxHp: 1500,
        currentHp: 1500,
      },
      include: {
        damageLogs: true,
      },
    });
  }

  const totalDamageDealt = boss.maxHp - boss.currentHp;
  const progressPercent = Math.min(100, Math.round((totalDamageDealt / boss.maxHp) * 100));

  return NextResponse.json({
    ok: true,
    data: {
      id: boss.id,
      name: boss.name,
      weekPeriod: boss.weekPeriod,
      maxHp: boss.maxHp,
      currentHp: boss.currentHp,
      isDefeated: boss.isDefeated,
      rewardClaimed: boss.rewardClaimed,
      progressPercent,
      recentStrikes: boss.damageLogs.map((d) => ({
        id: d.id,
        damage: d.damage,
        dealtAt: d.dealtAt,
      })),
    },
  });
}
