import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ idempotencyKey: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  const { idempotencyKey } = await params;

  const receipt = await prisma.mutationReceipt.findUnique({
    where: {
      userId_idempotencyKey: {
        userId: user.id,
        idempotencyKey,
      },
    },
  });

  if (!receipt) {
    return NextResponse.json(
      { ok: false, error: { code: "RECEIPT_NOT_FOUND", message: "No transaction receipt found for this key." } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      operation: receipt.operation,
      createdAt: receipt.createdAt,
      result: JSON.parse(receipt.responsePayload),
    },
  });
}
