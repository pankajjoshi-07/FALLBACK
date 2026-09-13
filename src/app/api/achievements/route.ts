import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  try {
    // Fetch all available achievements from the database
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      ok: true,
      data: allAchievements,
    });
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to fetch achievements." } },
      { status: 500 }
    );
  }
}
