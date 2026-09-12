import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { completeQuestTransaction } from "@/server/services/completion-service";

export async function POST(
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
  const idempotencyKey = req.headers.get("Idempotency-Key") || undefined;

  const result = await completeQuestTransaction({
    userId: user.id,
    questId: id,
    idempotencyKey,
  });

  if (!result.ok && result.error) {
    return NextResponse.json(result, { status: result.error.status || 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
