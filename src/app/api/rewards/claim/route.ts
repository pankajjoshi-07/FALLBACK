import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id || !user.character) {
      return NextResponse.json({ error: "Unauthorized or Character not found" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, reason } = body;

    const newGold = user.character.gold + amount;

    await prisma.$transaction([
      prisma.goldLedger.create({
        data: {
          userId: user.id,
          amount,
          balanceAfter: newGold,
          sourceType: "BOSS_REWARD",
          sourceId: crypto.randomUUID(),
          description: reason || "Reward for winning mini-game"
        }
      }),
      prisma.character.update({
        where: { userId: user.id },
        data: { gold: newGold, stateVersion: { increment: 1 } }
      })
    ]);

    return NextResponse.json({ success: true, gold: newGold });
  } catch (error) {
    console.error("Reward error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
