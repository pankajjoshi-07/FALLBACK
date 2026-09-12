import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const patchQuestSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  // Reward-affecting fields
  difficulty: z.enum(["TRIVIAL", "EASY", "MEDIUM", "HARD", "EPIC"]).optional(),
  attribute: z.enum(["STRENGTH", "INTELLECT", "DISCIPLINE", "VITALITY", "CHARISMA"]).optional(),
  cadence: z.enum(["ONCE", "DAILY", "WEEKLY"]).optional(),
  weeklyTarget: z.number().int().min(1).max(7).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id, archivedAt: null },
      include: { _count: { select: { completions: true } } },
    });

    if (!quest) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Quest not found." } },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = patchQuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const { title, description, dueDate, difficulty, attribute, cadence, weeklyTarget } = parsed.data;

    const hasCompletions = quest._count.completions > 0;
    const attemptedRewardEdit =
      (difficulty && difficulty !== quest.difficulty) ||
      (attribute && attribute !== quest.attribute) ||
      (cadence && cadence !== quest.cadence) ||
      (weeklyTarget && weeklyTarget !== quest.weeklyTarget);

    if (hasCompletions && attemptedRewardEdit) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "REWARD_FIELDS_LOCKED",
            message:
              "Difficulty, attribute, and cadence are locked after a quest has been completed to protect historical reward integrity. Please forge a new quest for different parameters.",
          },
        },
        { status: 409 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    if (!hasCompletions) {
      if (difficulty) updateData.difficulty = difficulty;
      if (attribute) updateData.attribute = attribute;
      if (cadence) updateData.cadence = cadence;
      if (weeklyTarget) updateData.weeklyTarget = weeklyTarget;
    }

    const updated = await prisma.quest.update({
      where: { id: quest.id },
      data: updateData,
    });

    return NextResponse.json({
      ok: true,
      data: updated,
    });
  } catch (err) {
    console.error("Patch quest error:", err);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to update quest." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const quest = await prisma.quest.findFirst({
      where: { id, userId: user.id },
    });

    if (!quest) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Quest not found." } },
        { status: 404 }
      );
    }

    // Soft archive to strictly preserve historical completion records
    await prisma.quest.update({
      where: { id: quest.id },
      data: { archivedAt: new Date() },
    });

    return NextResponse.json({
      ok: true,
      message: "Quest archived successfully. Historical chronicle remains intact.",
    });
  } catch (err) {
    console.error("Archive quest error:", err);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to archive quest." } },
      { status: 500 }
    );
  }
}
