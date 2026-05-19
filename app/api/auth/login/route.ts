// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { signToken, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return Response.json({ success: false, message: "Invalid payload format" }, { status: 400 });
    }

    const { username, password } = result.data;

    // Verify username and password hash
    const isPasswordValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    if (username !== ADMIN_USERNAME || !isPasswordValid) {
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
