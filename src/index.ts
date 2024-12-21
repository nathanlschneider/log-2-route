import {
  BodyShape,
  ConfigShape,
  DebugShape,
  ErrorShape,
  InfoShape,
  SuccessShape,
  WarnShape,
} from '@log-to-route/types';
import checkForFile from '@log-to-route/utils/checkForFile';
import defaultConfig from '@log-to-route/utils/defaultConfig';
import timeNow from '@log-to-route/utils/timeNow';
import validateApiKey from '@log-to-route/utils/validateApiKey';
import validateConfigShape from '@log-to-route/utils/validateConfigShape';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';

const log = async (data: BodyShape) => {
  try {
    await fetch(`http://localhost:3001/logger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.L2R_API_KEY}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
  }
};

export const logger = {
  error: async function (message: string) {
    const loggedError: ErrorShape = { message: message };
    try {
      await log({ type: 'error', time: timeNow(), data: loggedError });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  },

  info: async function (message: string) {
    const loggedInfo: InfoShape = { message: message };
    try {
      await log({ type: 'info', time: timeNow(), data: loggedInfo });
    } catch (err) {
      console.error('Failed to log info:', err);
    }
  },

  success: async function (message: string) {
    const loggedSuccess: SuccessShape = { message: message };
    try {
      await log({ type: 'success', time: timeNow(), data: loggedSuccess });
    } catch (err) {
      console.error('Failed to log success:', err);
    }
  },

  debug: async function (message: string) {
    const loggedDebug: DebugShape = { message: message };
    try {
      await log({ type: 'debug', time: timeNow(), data: loggedDebug });
    } catch (err) {
      console.error('Failed to log debug:', err);
    }
  },

  warn: async function (message: string, level: number) {
    const loggedWarn: WarnShape = { message: message, level: level };
    try {
      await log({ type: 'warn', time: timeNow(), data: loggedWarn });
    } catch (err) {
      console.error('Failed to log warn:', err);
    }
  },
};

export async function LogReceiver(req: Request): Promise<Response> {
  const isKeyValid = await validateApiKey(req);
  if (isKeyValid === false) {
    return new Response('Unauthorized', { status: 401 });
  }

  let send = { logLocation: '', logData: '' };

  const loggerConfigFile = path.join(process.cwd(), 'l2r.config.json');

  let loggerConfigFileContent = '{}'; // Default to an empty object
  if (await checkForFile(loggerConfigFile)) {
    try {
      loggerConfigFileContent = await fs.readFile(loggerConfigFile, 'utf-8');
    } catch (err) {
      console.error('Failed to read logger config file:', err);
    }
  }

  let loggerConfig: ConfigShape = JSON.parse(loggerConfigFileContent);

  const validConfig = await validateConfigShape(defaultConfig, loggerConfig);

  if (!validConfig) {
    console.error(
      chalk.bgRedBright(' ERROR '),
      'Invalid l2r config file. Using default config.'
    );
    loggerConfig = defaultConfig;
  }

  const colorMap: { [key: string]: (text: string) => string } = {
    error: chalk.bgRedBright,
    info: chalk.blueBright,
    debug: chalk.yellow,
    success: chalk.greenBright,
  };

  const body = await req.json();
  if (
    body == null ||
    typeof body.type !== 'string' ||
    body.type.length === 0 ||
    (body.logLocation === '' && body.logData === '')
  ) {
    return new Response('Invalid log type', { status: 400 });
  }

  try {
    const eventType = (colorMap[body.type] || chalk.greenBright)(
      body.type.toUpperCase()
    );

    const colorizedLocaleStr = `[${chalk.cyan(
      body.time.locale.split(', ')[0]
    )}, ${chalk.cyan(body.time.locale.split(', ')[1])}] ${eventType} - ${
      body.data.message
    }`;
    const formattedLocaleStr = `[${
      body.time.locale
    }] ${body.type.toUpperCase()} - ${body.data.message}`;
    const colorizedEpochStr = `[${chalk.cyan(
      body.time.epoch
    )}] ${eventType} - ${body.data.message}`;
    const formattedEpochStr = `[${
      body.time.epoch
    }] ${body.type.toUpperCase()} - ${body.data.message}`;

    if (loggerConfig.logFile.enabled) {
      if (loggerConfig.logFile.format === 'ndjson'.toLocaleLowerCase()) {
        const ndJsonStr = JSON.stringify(body);

        send.logLocation = `${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`;
        send.logData = ndJsonStr + '\n';
      } else {
        send.logLocation = `${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`;
        send.logData = loggerConfig.logFile.colorizeStyledLog
          ? body.time.type === 'epoch'
            ? colorizedEpochStr + '\n'
            : formattedEpochStr + '\n'
          : body.time.type === 'locale'
          ? colorizedLocaleStr + '\n'
          : formattedLocaleStr + '\n';
      }
    }

    if (loggerConfig.console.enabled) {
      if (loggerConfig.console.format === 'ndjson'.toLocaleLowerCase()) {
        const ndJsonStr = JSON.stringify(body);
        console.log(ndJsonStr);
      } else {
        console.log(
          loggerConfig.console.colorizeStyledLog
            ? loggerConfig.console.timeType === 'epoch'
              ? colorizedEpochStr
              : colorizedLocaleStr
            : loggerConfig.console.timeType === 'locale'
            ? formattedLocaleStr
            : formattedEpochStr
        );
      }
    }
    return new Response(JSON.stringify(send), {
      status: 200,
      statusText: 'Ok',
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 500, error: (error as Error).message }),
      { status: 500 }
    );
  }
}
