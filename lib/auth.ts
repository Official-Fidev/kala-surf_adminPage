// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ── Change these in production via environment variables ──────────
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// Default is bcrypt hash of "kalasurf2024"
export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$10$wSrEbkDvihv/EqlV0u7sreF0uoLts.ru2JeQ9oceyKihIo6Im8dEq";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kala-surf-admin-secret-2024-must-change-in-prod"
);

export const COOKIE_NAME = "kala_admin";

export async function signToken(payload: Record<string, string>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

/** Read and verify the auth cookie from a server component or route handler. */
export async function getAuthFromCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}
