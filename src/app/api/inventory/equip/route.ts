import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { equipItem } from "@/server/services/purchase-service";

const equipSchema = z.object({
  itemId: z.string().min(1, "Item ID is required."),
});

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
    const parsed = equipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION_FAILED", message: parsed.error.issues[0]?.message } },
        { status: 400 }
      );
    }

    const result = await equipItem({
      userId: user.id,
      itemId: parsed.data.itemId,
    });

    if (!result.ok && result.error) {
      return NextResponse.json(result, { status: result.error.status || 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Equip error:", err);
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to equip item." } },
      { status: 500 }
    );
  }
}
