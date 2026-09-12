import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { INITIAL_TEMPLATES } from "@/server/game/seed-data";

export async function GET() {
  try {
    const templates = await prisma.questTemplate.findMany({
      orderBy: [{ attribute: "asc" }, { difficulty: "asc" }],
    });

    if (templates.length > 0) {
      return NextResponse.json({ ok: true, data: templates });
    }
  } catch (err) {
    console.warn("Falling back to in-memory templates:", err);
  }

  // Graceful fallback to rich seed array
  return NextResponse.json({ ok: true, data: INITIAL_TEMPLATES });
}
