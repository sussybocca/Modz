import { createWorld, saveWorld, loadWorld } from "@/lib/mw";

export async function POST(req: Request) {
  const { name } = await req.json();
  const world = createWorld(name);
  return Response.json({ world: saveWorld(world) });
}

export async function PUT(req: Request) {
  const data = await req.text();
  const world = loadWorld(data);
  return Response.json({ world });
}
