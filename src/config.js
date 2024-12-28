#! /usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
  _                 ___  _____             _       
 | |               |__ \\|  __ \\           | |      
 | |     ___   __ _   ) | |__) |___  _   _| |_ ___ 
 | |    / _ \\ / _\` | / /|  _  // _ \\| | | | __/ _ \\
 | |___| (_) | (_| |/ /_| | \\ \\ (_) | |_| | ||  __/
 |______\\___/ \\__, |____|_|  \\_\\___/ \\__,_|\\__\\___|
               __/ |                               
              |___/
`);

console.log('Log 2 Route Configuration Creator');

const askQuestion = (question, defaultValue) => {
  return new Promise((resolve) => {
    rl.question(`${question} (default: ${defaultValue}): `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
};

const askForConfig = async (env) => {
  const hostname = await askQuestion(`Please enter the ${env} server hostname`, 'localhost');
  const port = await askQuestion(`Please enter the ${env} server port`, '3000');
  if (isNaN(port)) {
    console.log('Port must be a number. Please try again.');
    return askForConfig(env);
  }
  return { hostname, port };
};

const main = async () => {
  const devConfig = await askForConfig('development');
  const prodConfig = await askForConfig('production');

  const configContent = `
const serverConfig = {
  development: {
    serverOptions: {
      port: ${devConfig.port},
      host: '${devConfig.hostname}',
    },
  },
  production: {
    serverOptions: {
      port: ${prodConfig.port},
      host: '${prodConfig.hostname}',
    },
  },
};
export default serverConfig;
`;

  const configPath = path.join(process.cwd(), 'node_modules/log-2-route/dist/serverConfig.ts');
  fs.writeFile(configPath, configContent, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Server configurations saved');
    }
  });

  const loggerRoutePath = path.join(process.cwd(), 'app/logger');
  if (!fs.existsSync(loggerRoutePath)) {
    fs.mkdirSync(loggerRoutePath, { recursive: true });
    console.log('Created /app/logger route');
  }

  const sourceRouteFile = path.join(process.cwd(), '/node_modules/log-2-route/dist/route.ts');
  const destinationRouteFile = path.join(loggerRoutePath, 'route.ts');
  fs.copyFile(sourceRouteFile, destinationRouteFile, (err) => {
    if (err) {
      console.error('Error copying route file:', err);
    } else {
      console.log('Copied install/route.ts to /app/logger/route.ts');
    }
  });

  const sourceConfigFile = path.join(process.cwd(), '/node_modules/log-2-route/dist/l2r.config.json');
  const destinationConfigFile = path.join(process.cwd(), 'l2r.config.json');
  fs.copyFile(sourceConfigFile, destinationConfigFile, (err) => {
    if (err) {
      console.error('Error copying config file:', err);
    } else {
      console.log('Copied install/l2r.config.json to ' + process.cwd());
    }
    rl.close();
  });
};

main();