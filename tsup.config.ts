import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/config.js"],
  format: ["cjs", "esm"], 
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: false,
});
