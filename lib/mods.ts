export function createAPI(world) {
  return {
    expandRoom(x: number, y: number, z: number) {
      world.room.size = [x, y, z];
    }
  };
}

export function applyMods(world) {
  const api = createAPI(world);
  world.mods.forEach(mod => {
    const fn = new Function("Mod", mod.code);
    fn(api);
  });
}
