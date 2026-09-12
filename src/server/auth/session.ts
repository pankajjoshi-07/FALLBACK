import bcrypt from "bcryptjs";
import { currentUser as getClerkCurrentUser } from "@clerk/nextjs/server";
import { prisma } from "../db/prisma";

export const SESSION_COOKIE_NAME = "arcane_session";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Validates password criteria:
 * - Minimum 8 characters
 * - Explicitly rejects passwords exceeding bcrypt's 72 UTF-8 byte limit rather than silently truncating.
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }

  const byteLength = Buffer.byteLength(password, "utf8");
  if (byteLength > 72) {
    return {
      valid: false,
      message: "Password cannot exceed 72 UTF-8 bytes to ensure cryptographic security.",
    };
  }

  return { valid: true };
}

export async function hashPassword(password: string): Promise<string> {
  const check = validatePasswordStrength(password);
  if (!check.valid) {
    throw new Error(check.message);
  }
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const byteLength = Buffer.byteLength(password, "utf8");
  if (byteLength > 72) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Helper to ensure a Prisma user and character exist for the authenticated Clerk user.
 */
async function syncClerkUser(clerkUser: NonNullable<Awaited<ReturnType<typeof getClerkCurrentUser>>>) {
  const primaryEmail =
    clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase() ||
    clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  if (!primaryEmail && !clerkUser.id) return null;

  // 1. Try to find user by clerkId or primary email
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: clerkUser.id },
        ...(primaryEmail ? [{ email: primaryEmail }] : []),
      ],
    },
    include: {
      character: true,
    },
  });

  // 2. If user exists but clerkId is missing, update it
  if (user && (!user.clerkId || user.clerkId !== clerkUser.id)) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { clerkId: clerkUser.id },
      include: {
        character: true,
      },
    });
  }

  // 3. If user doesn't exist yet, auto-provision user and starting character
  if (!user) {
    const rawName =
      clerkUser.fullName ||
      (clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : null) ||
      clerkUser.username ||
      primaryEmail?.split("@")[0] ||
      "Adventurer";

    const displayName = rawName.slice(0, 40);
    const emailToUse = primaryEmail || `${clerkUser.id}@arcane-codex.internal`;

    user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          clerkId: clerkUser.id,
          email: emailToUse,
          displayName,
          activityTimezone: "UTC",
          displayTimezone: "UTC",
          timezoneLocked: false,
        },
      });

      const newCharacter = await tx.character.create({
        data: {
          userId: newUser.id,
          heroName: displayName,
          className: "Warrior",
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
          equippedAvatar: "avatar-warrior",
          equippedTitle: "Novice Adventurer",
          equippedFrame: "frame-apprentice",
          stateVersion: 1,
        },
      });

      await tx.goldLedger.create({
        data: {
          userId: newUser.id,
          amount: 0,
          balanceAfter: 0,
          sourceType: "INITIAL_BALANCE",
          sourceId: newCharacter.id,
          description: "Hero forged into Arcane Codex via Clerk SSO",
        },
      });

      return {
        ...newUser,
        character: newCharacter,
      };
    });
  }

  return user;
}

/**
 * Retrieves the currently authenticated user and character from Clerk.
 */
export async function getCurrentUser() {
  try {
    const clerkUser = await getClerkCurrentUser();
    if (!clerkUser) return null;

    return await syncClerkUser(clerkUser);
  } catch (error) {
    console.error("Clerk session lookup error:", error);
    return null;
  }
}

/**
 * Legacy compatibility stub
 */
export async function destroySession(): Promise<void> {
  // Clerk handles sessions via client signOut and server auth token expiration
}

export async function createSession(userId: string): Promise<string> {
  return userId;
}

