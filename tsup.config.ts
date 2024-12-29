import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils", "src/l2rTypes", "src/config"],
  format: ["cjs", "esm"], 
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: false,
});
