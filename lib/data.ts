// lib/data.ts — Server-only data access layer.
//
// Two concerns:
//   1. ITEM LIST — canonical source depends on mode:
//        • Cloudbeds mode  → fetchCloudbedsItems() in lib/cloudbeds.ts
//        • Fallback mode   → data/addons.json (read-only seed)
//   2. OVERRIDES (active toggle, image_url, display order) → PostgreSQL via Prisma
//      Both modes share the same Postgres override table.

import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

/* ── Shared types ────────────────────────────────────────────── */

export interface Addon {
  id: string;
  order: number;
  active: boolean;
  item_name: string;
  addon_name: string;
  charge_type: string;
  max_qty: number | null;
  image_url: string | null;
}

export interface Override {
  active?: boolean;
  image_url?: string | null;
  order?: number;
}

export type OverridesMap = Record<string, Override>;

/* ── Fallback item list (addons.json — read only) ────────────── */

const ADDONS_FILE = path.join(process.cwd(), "data", "addons.json");

export function readAddons(): Addon[] {
  try {
    return JSON.parse(fs.readFileSync(ADDONS_FILE, "utf-8")) as Addon[];
  } catch {
    return [];
  }
}

/** Convenience: find one addon by id from fallback JSON */
export function findAddon(id: string): Addon | undefined {
  return readAddons().find((a) => a.id === id);
}

/* ── Postgres override CRUD (async) ──────────────────────────── */

/**
 * Load ALL overrides from Postgres into a map keyed by Cloudbeds itemID.
 * Used in the GET /api/addons handler to merge with the item list in one shot.
 */
export async function readOverrides(): Promise<OverridesMap> {
  const rows = await prisma.addonOverride.findMany();
  const map: OverridesMap = {};
  for (const row of rows) {
    map[row.cloudbeds_item_id] = {
      active:    row.active,
      image_url: row.image_url,
      order:     row.display_order ?? undefined,
    };
  }
  return map;
}

/**
 * Get a single override by id.
 * Returns {} (empty) if no override row exists yet for this item.
 */
export async function getOverride(id: string): Promise<Override> {
  const row = await prisma.addonOverride.findUnique({
    where: { cloudbeds_item_id: id },
  });
  if (!row) return {};
  return {
    active:    row.active,
    image_url: row.image_url,
    order:     row.display_order ?? undefined,
  };
}

/**
 * Create or update an override for an item.
 * Uses upsert so the first toggle/image for a new item is handled seamlessly.
 */
export async function setOverride(id: string, patch: Partial<Override>): Promise<void> {
  // Map our generic Override keys to Prisma model field names
  const data: {
    active?: boolean;
    image_url?: string | null;
    display_order?: number;
  } = {};
  if (patch.active    !== undefined) data.active        = patch.active;
  if (patch.image_url !== undefined) data.image_url     = patch.image_url;
  if (patch.order     !== undefined) data.display_order = patch.order;

  await prisma.addonOverride.upsert({
    where:  { cloudbeds_item_id: id },
    create: { cloudbeds_item_id: id, ...data },
    update: data,
  });
}
