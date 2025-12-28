import JSZip from "jszip";

export async function readZip(file: File) {
  const zip = await JSZip.loadAsync(file);
  const mainJsFile = zip.file("main.js");
  if (!mainJsFile) throw new Error("main.js not found in zip");

  const code = await mainJsFile.async("string");

  // Collect all other files as assets
  const assets: Record<string, ArrayBuffer> = {};
  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.name !== "main.js") {
      assets[zipEntry.name] = zipEntry.async("arraybuffer") as any;
    }
  });

  return { code, assets };
}
