import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { hashPassword, createSession, validatePasswordStrength } from "@/server/auth/session";

const registerSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address."),
  password: z.string(),
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(40),
  heroName: z.string().trim().min(2).max(40).optional(),
  className: z.enum(["Warrior", "Scholar", "Monk", "Bard", "Artisan"]).default("Warrior"),
  activityTimezone: z.string().default("UTC"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid input fields.",
          },
        },
        { status: 400 }
      );
    }

    const { email, password, displayName, heroName, className, activityTimezone } = parsed.data;

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "PASSWORD_WEAK",
            message: pwCheck.message || "Password must be at least 12 characters and max 72 bytes.",
          },
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "EMAIL_EXISTS",
            message: "An account with this email address already exists.",
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Initial character avatar mapping based on selected class
    const avatarMap: Record<string, string> = {
      Warrior: "avatar-warrior",
      Scholar: "avatar-scholar",
      Monk: "avatar-monk",
      Bard: "avatar-bard",
      Artisan: "avatar-artisan",
    };

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          displayName,
          activityTimezone,
          displayTimezone: activityTimezone,
          timezoneLocked: false,
        },
      });

      const newCharacter = await tx.character.create({
        data: {
          userId: newUser.id,
          heroName: heroName || displayName,
          className,
          lifetimeXp: 0,
          gold: 0,
          strengthXp: 0,
          intellectXp: 0,
          disciplineXp: 0,
          vitalityXp: 0,
          charismaXp: 0,
          currentStreak: 0,
          longestStreak: 0,
          equippedTheme: "theme-midnight",
          equippedAvatar: avatarMap[className] || "avatar-warrior",
          equippedTitle: "Novice Adventurer",
          equippedFrame: "frame-apprentice",
          stateVersion: 1,
        },
      });

      // Initial zero-balance ledger entry
      await tx.goldLedger.create({
        data: {
          userId: newUser.id,
          amount: 0,
          balanceAfter: 0,
          sourceType: "INITIAL_BALANCE",
          sourceId: newCharacter.id,
          description: "Hero forged into Arcane Codex",
        },
      });

      return {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        activityTimezone: newUser.activityTimezone,
        character: newCharacter,
      };
    });

    // Create session cookie
    await createSession(user.id);

    return NextResponse.json(
      {
        ok: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "REGISTRATION_ERROR",
          message: "An unexpected error occurred during account creation.",
        },
      },
      { status: 500 }
    );
  }
}
