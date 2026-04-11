import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/sandbox-entry.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  target: "esnext",
  sourcemap: false,
  minify: false,
  external: ["cloudflare:sockets"],
  outExtension: () => ({ js: ".mjs" })
});
