// app/api/addons/[id]/image/route.ts
// POST  /api/addons/:id/image — admin only — multipart upload
// DELETE /api/addons/:id/image — admin only — removes image
//
// File is saved to public/uploads/ (persistent on VPS).
// image_url is stored in Postgres via setOverride().
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { setOverride } from "@/lib/data";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED    = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie();
  if (!auth) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return Response.json({ success: false, message: "No image provided" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      { success: false, message: "Unsupported type — use jpg, png, webp, or gif" },
      { status: 415 }
    );
  }

  // Save and compress file
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const filename = `${id}.webp`;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(filePath);

  const imageUrl = `/uploads/${filename}`;

  // Persist URL to Postgres
  await setOverride(id, { image_url: imageUrl });

  return Response.json({ success: true, image_url: imageUrl, data: { id, image_url: imageUrl } });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthFromCookie();
  if (!auth) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Clear image_url in Postgres
  await setOverride(id, { image_url: null });

  return Response.json({ success: true, data: { id, image_url: null } });
}
