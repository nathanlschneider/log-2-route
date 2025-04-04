const fs = require("fs");
const path = require("path");
const chalk = require("chalk"); // Assuming chalk is installed for colored console output

// Path to the user's Next.js app's `app` directory
const mainAppPath = path.dirname(require.main.filename);

const appPath = mainAppPath.split("/node_modules/")[0];

// Check if the `/app` directory exists
if (!fs.existsSync(appPath + "/app")) {
  console.error(chalk.red("\nError: /app directory does not exist."));
  process.exit(1);
}

// Ensure `/app/logger` directory exists
const loggerRoutePath = path.join(appPath, "/app/logger");
if (!fs.existsSync(loggerRoutePath)) {
  fs.mkdirSync(loggerRoutePath, { recursive: true });
  console.log(chalk.green("Created /app/logger route"));
}

// Path to the source `route.ts` file in `node_modules/log-2-route`
const sourceRouteFile = path.join(
  appPath,
  "/node_modules/log-2-route/install/route.ts"
);
const destinationRouteFile = path.join(loggerRoutePath, "route.ts");

// Copy the `route.ts` file to the `/app/logger/` route
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

// Path for the `.well-known` directory inside `/app/logger`
const wellKnownDir = path.join(loggerRoutePath, ".well-known");
const sourceFile = path.resolve(
  __dirname,
  "src/api/.well-known/your-service.ts"
);

// Ensure the target `.well-known` directory exists inside `/app/logger`
if (!fs.existsSync(wellKnownDir)) {
  console.log(`Creating the directory: ${wellKnownDir}`);
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

// Check if the file already exists
if (fs.existsSync(path.join(wellKnownDir, "your-service.ts"))) {
  console.log("API route already exists. Skipping copy.");
} else {
  // Copy the file
  console.log(`Copying API route to ${wellKnownDir}`);
  fs.copyFileSync(
    appPath + "/node_modules/log-2-route/api/.well-known/your-service.ts",
    path.join(wellKnownDir, "your-service.ts")
  );
}

console.log("Post-install script completed.");
