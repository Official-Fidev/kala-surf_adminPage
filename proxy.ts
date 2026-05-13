// proxy.ts — was middleware.ts; renamed per Next.js 16 convention.
// Protects all admin pages; public API routes pass through freely.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kala-surf-admin-secret-2024-must-change-in-prod"
);
const COOKIE_NAME = "kala_admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow: login page, public API, Next.js internals, static assets
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/addons") ||   // public read — auth checked per-verb in handler
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // All other routes require a valid JWT cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
