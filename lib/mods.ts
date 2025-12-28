import { World, Mod } from "./mw";

/**
 * Creates the API that mods can interact with.
 * Allows mods to manipulate the world safely.
 */
export function createAPI(world: World) {
  return {
    // Expand or resize the room
    expandRoom(x: number, y: number, z: number) {
      world.room.size = [x, y, z];
    },

    // Add a new mod programmatically
    addMod(code: string, assets?: Record<string, ArrayBuffer>) {
      world.mods.push({ code, assets });
    },

    // Log from a mod
    log(message: string) {
      console.log(`[Mod Log]: ${message}`);
    },

    // Example: add an item (placeholder for future item system)
    addItem(name: string, data: any) {
      if (!world.items) world.items = [];
      world.items.push({ name, data });
    },
  };
}

/**
 * Applies all mods in the world.
 * Each mod receives the safe API to manipulate the world.
 */
export function applyMods(world: World) {
  const api = createAPI(world);

  world.mods.forEach((mod: Mod, index: number) => {
    try {
      // Create a function from the mod code
      // It receives the API object as a parameter
      const fn = new Function("Mod", mod.code);
      fn(api);
    } catch (err) {
      console.error(`Error applying mod #${index}:`, err);
    }
  });
}

/**
 * Apply a single mod dynamically
 */
export function applyMod(world: World, mod: Mod) {
  const api = createAPI(world);
  try {
    const fn = new Function("Mod", mod.code);
    fn(api);
    world.mods.push(mod); // Add to world after applying
  } catch (err) {
    console.error("Error applying single mod:", err);
  }
}

/**
 * Utility to remove a mod by index
 */
export function removeMod(world: World, index: number) {
  if (index < 0 || index >= world.mods.length) return;
  world.mods.splice(index, 1);
}
