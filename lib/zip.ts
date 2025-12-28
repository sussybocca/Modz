import JSZip from "jszip";

export async function readZip(file: File) {
  const zip = await JSZip.loadAsync(file);

  // Find main JS file
  const mainJsFile = zip.file("main.js");
  if (!mainJsFile) throw new Error("main.js not found in ZIP");

  const code = await mainJsFile.async("string");

  // Collect all other files as assets
  const assets: Record<string, ArrayBuffer> = {};
  const assetPromises: Promise<void>[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.name !== "main.js" && !zipEntry.dir) {
      const p = zipEntry.async("arraybuffer").then((data) => {
        assets[zipEntry.name] = data;
      });
      assetPromises.push(p);
    }
  });

  // Wait for all assets to finish loading
  await Promise.all(assetPromises);

  return { code, assets };
}
