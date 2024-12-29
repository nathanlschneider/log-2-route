import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils", "src/types"],
  format: ["cjs", "esm"], 
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: false,
});
