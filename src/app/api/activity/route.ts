import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const whereClause: Record<string, unknown> = {
    userId: user.id,
  };

  if (from || to) {
    whereClause.localDate = {};
    if (from) (whereClause.localDate as Record<string, string>).gte = from;
    if (to) (whereClause.localDate as Record<string, string>).lte = to;
  }

  const days = await prisma.activityDay.findMany({
    where: whereClause,
    orderBy: { localDate: "asc" },
  });

  return NextResponse.json({
    ok: true,
    data: days,
  });
}
