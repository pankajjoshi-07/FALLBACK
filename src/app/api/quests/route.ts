import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { generatePeriodKey } from "@/server/game/streaks";
import { calculateQuestReward } from "@/server/game/streaks";
import { DIFFICULTY_XP } from "@/server/game/progression";

const createQuestSchema = z.object({
  title: z.string().trim().min(1, "Quest title cannot be empty.").max(120, "Title cannot exceed 120 characters."),
  description: z.string().trim().max(2000, "Description cannot exceed 2000 characters.").optional(),
  difficulty: z.enum(["TRIVIAL", "EASY", "MEDIUM", "HARD", "EPIC"]),
  attribute: z.enum(["STRENGTH", "INTELLECT", "DISCIPLINE", "VITALITY", "CHARISMA"]),
  cadence: z.enum(["ONCE", "DAILY", "WEEKLY"]),
  weeklyTarget: z.number().int().min(1).max(7).default(1),
  dueDate: z.string().datetime().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const attributeFilter = searchParams.get("attribute");
  const cadenceFilter = searchParams.get("cadence");
  const searchQuery = searchParams.get("search");

  const whereClause: Record<string, unknown> = {
    userId: user.id,
    archivedAt: null,
  };

  if (attributeFilter && attributeFilter !== "ALL") {
    whereClause.attribute = attributeFilter;
  }
  if (cadenceFilter && cadenceFilter !== "ALL") {
    whereClause.cadence = cadenceFilter;
  }
  if (searchQuery && searchQuery.trim().length > 0) {
    whereClause.title = {
      contains: searchQuery.trim(),
      mode: "insensitive",
    };
  }

  const quests = await prisma.quest.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      completions: {
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
        take: 10,
      },
    },
  });

  const now = new Date();
  const timezone = user.activityTimezone || "UTC";

  // Decorate each quest with current period completion status & reward preview
  const decoratedQuests = quests.map((q) => {
    const periodKey = generatePeriodKey(q.cadence, now, timezone);
    const periodCompletions = q.completions.filter((c) => c.periodKey === periodKey);
    const maxAllowed = q.cadence === "WEEKLY" ? Math.max(1, q.weeklyTarget) : 1;
    const isCompletedForPeriod = periodCompletions.length >= maxAllowed;

    const baseXp = DIFFICULTY_XP[q.difficulty] || 25;
    const rewardPreview = calculateQuestReward(baseXp, user.character?.currentStreak || 0);

    return {
      id: q.id,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      attribute: q.attribute,
      cadence: q.cadence,
      weeklyTarget: q.weeklyTarget,
      dueDate: q.dueDate,
      createdAt: q.createdAt,
      totalCompletionsCount: q.completions.length,
      periodCompletionsCount: periodCompletions.length,
      isCompletedForPeriod,
      rewardPreview,
    };
  });

  return NextResponse.json({
    ok: true,
    data: decoratedQuests,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createQuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid quest parameters.",
          },
        },
        { status: 400 }
      );
    }

    const { title, description, difficulty, attribute, cadence, weeklyTarget, dueDate } = parsed.data;

    const quest = await prisma.quest.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        difficulty,
        attribute,
        cadence,
        weeklyTarget: cadence === "WEEKLY" ? weeklyTarget : 1,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: quest,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Quest creation error:", err);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to forge quest." } },
      { status: 500 }
    );
  }
}
