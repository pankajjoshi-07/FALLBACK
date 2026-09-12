import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "healthy",
    project: "Arcane Codex — Life RPG",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
