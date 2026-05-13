// app/api/auth/logout/route.ts
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });
}
