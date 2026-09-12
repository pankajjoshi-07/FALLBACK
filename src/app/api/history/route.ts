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
  const cursor = searchParams.get("cursor");
  const limitParam = parseInt(searchParams.get("limit") || "20", 10);
  const limit = Math.min(Math.max(limitParam, 1), 100);
  const attributeFilter = searchParams.get("attribute");

  const whereClause: Record<string, unknown> = {
    userId: user.id,
  };

  if (attributeFilter && attributeFilter !== "ALL") {
    whereClause.attribute = attributeFilter;
  }

  const logs = await prisma.completionLog.findMany({
    where: whereClause,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { completedAt: "desc" },
  });

  let nextCursor: string | null = null;
  if (logs.length > limit) {
    const nextItem = logs.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  const totalCount = await prisma.completionLog.count({
    where: whereClause,
  });

  return NextResponse.json({
    ok: true,
    data: {
      items: logs,
      nextCursor,
      totalCount,
    },
  });
}
