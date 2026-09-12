import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "../db/prisma";
import crypto from "crypto";

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
  // Cost factor 12 as required by specification
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const byteLength = Buffer.byteLength(password, "utf8");
  if (byteLength > 72) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Generates a cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a database session and sets the HttpOnly cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });

  return sessionToken;
}

/**
 * Retrieves the currently authenticated user and character from the session cookie.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            character: true,
          },
        },
      },
    });

    if (!session) return null;

    // Check expiration
    if (session.expires < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Session lookup error:", error);
    return null;
  }
}

/**
 * Deletes the session from the database and removes the cookie.
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      }).catch(() => {});
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Destroy session error:", error);
  }
}
