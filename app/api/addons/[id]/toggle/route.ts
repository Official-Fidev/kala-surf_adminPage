// app/api/addons/[id]/toggle/route.ts
// PATCH /api/addons/:id/toggle — admin only (requires auth cookie)
// Flips the active boolean for a given Cloudbeds itemID in Postgres.
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { getOverride, setOverride } from "@/lib/data";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie();
  if (!auth) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Read current state from Postgres. If no row exists yet, default is active=true.
  const ov = await getOverride(id);
  const currentActive = ov.active !== undefined ? ov.active : true;
  const newActive = !currentActive;

  await setOverride(id, { active: newActive });

  return Response.json({
    success: true,
    data: { id, active: newActive },
  });
}
