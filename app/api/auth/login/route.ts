// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { signToken, ADMIN_USERNAME, ADMIN_PASSWORD, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ username, role: "admin" });

    const response = Response.json({ success: true, message: "Logged in" });

    // Set httpOnly cookie — secure in production
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 3600}${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return new Response(response.body, { status: 200, headers });
  } catch {
    return Response.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}
