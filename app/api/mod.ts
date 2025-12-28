import { readZip } from "@/lib/zip";
import { bundle } from "@/lib/bundler";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const code = await readZip(file);
  const bundled = await bundle(code);

  return Response.json({ code: bundled });
}
