import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const { name, world, bundle } = await req.json();
  const base = `Worlds/${name}/`;

  const index = `
<!DOCTYPE html>
<html>
<body>
<div id="app"></div>
<script type="module" src="./bundle.js"></script>
</body>
</html>
`;

  await put(base + "index.html", index, { access: "public" });
  await put(base + "world.mw", world, { access: "public" });
  await put(base + "bundle.js", bundle, { access: "public" });

  // Upload all mod assets
  const parsed = JSON.parse(world);
  for (const mod of parsed.mods) {
    if (mod.assets) {
      for (const [filename, buffer] of Object.entries(mod.assets)) {
        await put(base + "assets/" + filename, buffer as ArrayBuffer, { access: "public" });
      }
    }
  }

  return Response.json({
    url: `https://modz.vercel.app/Worlds/${name}/`,
  });
}
