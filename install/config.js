const fs = require('fs');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.greenBright(`
  _                 ___  _____             _       
 | |               |__ \\|  __ \\           | |      
 | |     ___   __ _   ) | |__) |___  _   _| |_ ___ 
 | |    / _ \\ / _\` | / /|  _  // _ \\| | | | __/ _ \\
 | |___| (_) | (_| |/ /_| | \\ \\ (_) | |_| | ||  __/
 |______\\___/ \\__, |____|_|  \\_\\___/ \\__,_|\\__\\___|
               __/ |                               
              |___/
`));

console.log(chalk.blueBright('Log-2-Route Configuration Creator\n'));

const askQuestion = (question, defaultValue) => {
  return new Promise((resolve, reject) => {
    rl.question(`${question} (default: ${chalk.gray(defaultValue)}): `, (answer) => {
      if (answer.trim() === '') {
        resolve(defaultValue);
      } else {
        resolve(answer);
      }
    });
  });
};

const askForConfig = async (env) => {
  try {
    const hostname = await askQuestion(`Please enter the ${env} server hostname`, 'localhost');
    const port = await askQuestion(`Please enter the ${env} server port`, '3000');
    if (isNaN(port)) {
      throw new Error('Port must be a number');
    }
    return { hostname, port };
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
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

  const configPath = path.join(process.cwd(), 'node_modules/log-2-route/src/config/serverConfig.ts');
  fs.writeFile(configPath, configContent, (err) => {
    if (err) {
      console.error(chalk.red('\nError writing to file!'), (err instanceof Error) ? err.message : err);
      process.exit(1);
    } else {
      console.log(chalk.green('Server configurations saved'));
    }
  });

  const appPath = path.join(process.cwd(), 'app');
  if (!fs.existsSync(appPath)) {
    console.error(chalk.red('\nError: /app directory does not exist.'));
    process.exit(1);
  }

  const loggerRoutePath = path.join(appPath, 'logger');
  if (!fs.existsSync(loggerRoutePath)) {
    fs.mkdirSync(loggerRoutePath, { recursive: true });
    console.log(chalk.green('Created /app/logger route'));
  }

  const sourceRouteFile = path.join(process.cwd(), '/node_modules/log-2-route/install/route.ts');
  const destinationRouteFile = path.join(loggerRoutePath, 'route.ts');
  fs.copyFile(sourceRouteFile, destinationRouteFile, (err) => {
    if (err) {
      console.error(chalk.red('\nError copying route file!'),(err instanceof Error) ? err.message : err);
      process.exit(1);
    } else {
      console.log('Copied install/route.ts to /app/logger/route.ts');
    }
  });

  const sourceConfigFile = path.join(process.cwd(), '/node_modules/log-2-route/install/l2r.config.json');
  const destinationConfigFile = path.join(process.cwd(), 'l2r.config.json');
  fs.copyFile(sourceConfigFile, destinationConfigFile, (err) => {
    if (err) {
      console.error(chalk.red('\nError copying config file!'),(err instanceof Error) ? err.message : err);
      process.exit(1);
    } else {
      console.log('Copied install/l2r.config.json to ' + process.cwd());
    }
    rl.close();
  });
};

main();