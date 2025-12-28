// lib/mods.ts
import { World, Mod } from "./mw";

/**
 * Create an API that mods can use to manipulate the world.
 */
export function createAPI(world: World) {
  return {
    expandRoom(x: number, y: number, z: number) {
      world.room.size = [x, y, z];
    },

    addItem(name: string, data: unknown) {
      // Safely initialize items array if it doesn't exist
      if (!("items" in world)) {
        (world as World & { items: { name: string; data: unknown }[] }).items = [];
      }
      (world as World & { items: { name: string; data: unknown }[] }).items.push({ name, data });
    },

    addMod(mod: Mod) {
      world.mods.push(mod);
    },
  };
}

/**
 * Apply all mods safely.
 */
export function applyMods(world: World) {
  const api = createAPI(world);

  world.mods.forEach((mod) => {
    try {
      const fn = new Function("Mod", mod.code);
      fn(api);
    } catch (err) {
      console.error("Failed to apply mod:", err);
    }
  });
}
