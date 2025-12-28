import esbuild from "esbuild";

export async function bundle(code: string) {
  const result = await esbuild.build({
    stdin: { contents: code, loader: "js" },
    bundle: true,
    write: false,
    format: "esm"
  });
  return result.outputFiles[0].text;
}
