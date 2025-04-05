import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const mainAppPath = dirname(fileURLToPath(import.meta.url));

const appPath = mainAppPath.split("/node_modules/")[0];

if (!fs.existsSync(appPath + "/app")) {
  console.error(chalk.red("\nError: /app directory does not exist."));
  process.exit(1);
}

const loggerRoutePath = path.join(appPath, "/app/logger");
if (!fs.existsSync(loggerRoutePath)) {
  fs.mkdirSync(loggerRoutePath, { recursive: true });
  console.log(chalk.green("Created /app/logger route"));
}

const sourceRouteFile = path.join(
  appPath,
  "/node_modules/log-2-route/install/route.ts"
);
const destinationRouteFile = path.join(loggerRoutePath, "route.ts");

fs.copyFile(sourceRouteFile, destinationRouteFile, (err) => {
  if (err) {
    console.error(
      chalk.red("\nError copying route file!"),
      err instanceof Error ? err.message : err
    );
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
    appPath + "/node_modules/log-2-route/api/.well-known/route.ts",
    path.join(wellKnownDir, "route.ts")
  );
}

console.log("Post-install script completed.");
