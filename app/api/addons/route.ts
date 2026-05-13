// app/api/addons/route.ts
// PUBLIC endpoint — callable from external booking website (CORS: *).
// GET /api/addons          → all addons (Cloudbeds + Postgres overrides)
// GET /api/addons?active=1 → only active addons
export const dynamic = "force-dynamic";

import { isCloudbedsConfigured, fetchCloudbedsItems } from "@/lib/cloudbeds";
import { readAddons, readOverrides } from "@/lib/data";
import type { Addon } from "@/lib/data";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActive = searchParams.get("active") === "1";

  let addons: Addon[];

  // Load Postgres overrides (used in both modes)
  const overrides = await readOverrides();

  /* ── Cloudbeds mode ─────────────────────────────────────────── */
  if (isCloudbedsConfigured()) {
    try {
      const items = await fetchCloudbedsItems();

      addons = items.map((item, index) => {
        const ov = overrides[item.itemID] ?? {};
        return {
          id:          item.itemID,
          order:       ov.order ?? index + 1,
          active:      ov.active !== undefined ? ov.active : true,
          item_name:   item.name,
          addon_name:  item.categoryName ?? "",
          charge_type: item.itemType ?? "",
          max_qty:     null,
          image_url:   ov.image_url !== undefined ? ov.image_url : null,
        };
      });
    } catch (err) {
      console.error("[api/addons] Cloudbeds fetch failed, using local data:", err);
      addons = mergeWithOverrides(readAddons(), overrides);
    }
  } else {
    /* ── Fallback mode ───────────────────────────────────────── */
    addons = mergeWithOverrides(readAddons(), overrides);
  }

  addons.sort((a, b) => a.order - b.order);
  if (onlyActive) addons = addons.filter((a) => a.active);

  return Response.json({ success: true, data: addons }, { headers: CORS });
}

/** Merge addons.json items with Postgres overrides */
function mergeWithOverrides(addons: Addon[], overrides: Record<string, { active?: boolean; image_url?: string | null; order?: number }>): Addon[] {
  return addons.map((a) => {
    const ov = overrides[a.id] ?? {};
    return {
      ...a,
      active:    ov.active    !== undefined ? ov.active    : a.active,
      image_url: ov.image_url !== undefined ? ov.image_url : a.image_url,
      order:     ov.order     !== undefined ? ov.order     : a.order,
    };
  });
}
