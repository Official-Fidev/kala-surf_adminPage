// lib/cloudbeds.ts — Cloudbeds API v1.2 client (server-only)
// Docs: https://hotels.cloudbeds.com/api/v1.2/docs
//
// Actual response fields confirmed from live API (debug endpoint):
//   itemID, itemType, sku, itemCode, name, categoryID, categoryName,
//   description, price, stockInventory, taxes, totalTaxes, fees,
//   totalFees, priceWithoutFeesAndTaxes, grandTotal

export interface CloudbedsItem {
  itemID: string;
  itemType: string;        // "service" | "product"
  sku: string;
  itemCode: string;
  name: string;            // the item display name
  categoryID: string;
  categoryName: string;    // e.g. "Transport", "Insurance"
  description: string;
  price: number;
  grandTotal: number;
  stockInventory: boolean;
}

export interface CloudbedsApiResponse {
  success: boolean;
  total?: number;
  data: CloudbedsItem[];
}

/**
 * Returns true if all required Cloudbeds env vars are set.
 */
export function isCloudbedsConfigured(): boolean {
  return !!(
    process.env.CLOUDBEDS_API_KEY &&
    process.env.CLOUDBEDS_PROPERTY_ID
  );
}

/**
 * Fetches all items from the Cloudbeds property via GET /api/v1.2/getItems.
 * Uses the API key as a Bearer token.
 * Throws if the request fails — caller should catch and fall back.
 */
export async function fetchCloudbedsItems(): Promise<CloudbedsItem[]> {
  const apiKey     = process.env.CLOUDBEDS_API_KEY!;
  const propertyId = process.env.CLOUDBEDS_PROPERTY_ID!;

  const url = `https://hotels.cloudbeds.com/api/v1.2/getItems?propertyID=${propertyId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudbeds API ${res.status}: ${text}`);
  }

  const json: CloudbedsApiResponse = await res.json();

  if (!json.success) {
    throw new Error(`Cloudbeds API returned success:false`);
  }

  return json.data ?? [];
}
