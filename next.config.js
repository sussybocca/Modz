import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Absolute import alias
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };

    // Externalize esbuild so webpack doesn't parse .d.ts files
    config.externals = [...(config.externals || []), "esbuild"];

    return config;
  },
};

export default nextConfig;
