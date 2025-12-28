import { World, Mod } from "./mw";

/**
 * Create an API that mods can use to manipulate the world.
 */
export function createAPI(world: World) {
  return {
    expandRoom(x: number, y: number, z: number) {
      world.room.size = [x, y, z];
    },

    // Example: add an item safely
    addItem(name: string, data: unknown) {
      if (!world.items) world.items = [];
      world.items.push({ name, data });
    },

    // Example: add a mod dynamically
    addMod(mod: Mod) {
      world.mods.push(mod);
    },
  };
}

/**
 * Apply all mods in the world safely.
 */
export function applyMods(world: World) {
  const api = createAPI(world);

  world.mods.forEach((mod) => {
    try {
      // Wrap dynamic execution safely
      const fn = new Function("Mod", mod.code);
      fn(api);
    } catch (err) {
      console.error("Failed to apply mod:", err);
    }
  });
}
