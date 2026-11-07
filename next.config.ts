import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Keep database drivers out of the bundle: PGlite loads WASM by file URL and breaks when bundled.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
};
export default nextConfig;
