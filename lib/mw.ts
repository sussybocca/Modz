export type Mod = {
  code: string;
  assets?: Record<string, ArrayBuffer>; // Store all mod assets here
};

export type World = {
  name: string;
  room: { size: [number, number, number] };
  mods: Mod[];
};

export function createWorld(name: string): World {
  return { name, room: { size: [10, 5, 10] }, mods: [] };
}

// Save world to JSON (including mod assets)
export function saveWorld(world: World) {
  // Convert ArrayBuffers to Base64 for JSON storage
  const serializedMods = world.mods.map(mod => ({
    code: mod.code,
    assets: mod.assets
      ? Object.fromEntries(
          Object.entries(mod.assets).map(([key, buffer]) => [
            key,
            Buffer.from(buffer).toString("base64"),
          ])
        )
      : undefined,
  }));

  return JSON.stringify({
    ...world,
    mods: serializedMods,
  });
}

// Load world from JSON (convert Base64 back to ArrayBuffer)
export function loadWorld(data: string): World {
  const parsed = JSON.parse(data);
  const mods = parsed.mods.map((mod: any) => ({
    code: mod.code,
    assets: mod.assets
      ? Object.fromEntries(
          Object.entries(mod.assets).map(([key, b64]) => [
            key,
            Uint8Array.from(Buffer.from(b64, "base64")).buffer,
          ])
        )
      : undefined,
  }));

  return {
    ...parsed,
    mods,
  };
}
