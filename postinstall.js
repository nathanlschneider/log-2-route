import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const mainAppPath = dirname(fileURLToPath(import.meta.url));

const appPath = mainAppPath.split("/node_modules/")[0];

if (!fs.existsSync(appPath + "/app")) {
  console.error("\nError: /app directory does not exist.");
  process.exit(1);
}

const loggerRoutePath = path.join(appPath, "/app/logger");
if (!fs.existsSync(loggerRoutePath)) {
  fs.mkdirSync(loggerRoutePath, { recursive: true });
  console.log("Created /app/logger route");
}

const sourceRouteFile = path.join(
  appPath,
  "/node_modules/error-aware-client/install/route.ts"
);
const destinationRouteFile = path.join(loggerRoutePath, "route.ts");

fs.copyFile(sourceRouteFile, destinationRouteFile, (err) => {
  if (err) {
    console.error("\nError copying route file!"),
      err instanceof Error ? err.message : err;
    process.exit(1);
  } else {
    console.log("Copied install/route.ts to /app/logger/route.ts");
  }
});

const wellKnownDir = path.join(loggerRoutePath, ".well-known");

if (!fs.existsSync(wellKnownDir)) {
  console.log(`Creating the directory: ${wellKnownDir}`);
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

if (fs.existsSync(path.join(wellKnownDir, "route.ts"))) {
  console.log("API route already exists. Skipping copy.");
} else {
  console.log(`Copying API route to ${wellKnownDir}`);
  fs.copyFileSync(
    appPath + "/node_modules/error-aware-client/api/.well-known/route.ts",
    path.join(wellKnownDir, "route.ts")
  );
}

if (fs.existsSync(path.join(wellKnownDir, "public.pem"))) {
  console.log("Public Key already exists. Skipping copy.");
} else {
  console.log(`Copying Public Key to ${wellKnownDir}`);
  fs.copyFileSync(
    appPath + "/node_modules/error-aware-client/api/.well-known/public.pem",
    path.join(wellKnownDir, "public.pem")
  );
}

console.log("Post-install script completed.");
