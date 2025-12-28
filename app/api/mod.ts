import { readZip } from "@/lib/zip";
import { bundle } from "@/lib/bundler";
import { NextRequest, NextResponse } from "next/server";

// Store uploaded mods in memory (you can replace with DB or Vercel Blob later)
const uploadedMods: Record<string, { code: string; assets: Record<string, ArrayBuffer> }> = {};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Extract JS code and assets from the ZIP
  const { code, assets } = await readZip(file);

  if (!code) {
    return NextResponse.json({ error: "ZIP must contain a JS code file" }, { status: 400 });
  }

  // Bundle JS code using esbuild
  let bundledCode: string;
  try {
    bundledCode = await bundle(code);
  } catch (err) {
    return NextResponse.json({ error: "Failed to bundle JS mod", details: String(err) }, { status: 500 });
  }

  // Save mod in memory (keyed by file name for now)
  uploadedMods[file.name] = { code: bundledCode, assets };

  return NextResponse.json({
    message: "Mod uploaded successfully",
    name: file.name,
    code: bundledCode,
    assets: Object.keys(assets),
  });
}
