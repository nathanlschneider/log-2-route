import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/config.js", "install/route.ts", "install/l2r.config.json", "src/config/serverConfig.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
