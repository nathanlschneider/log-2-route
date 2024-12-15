'user server';

import { appendFile } from 'node:fs';
import path from 'path';
import chalk from 'chalk';
import { promises as fs } from 'fs';

type TimeShape = {
  locale: string;
  epoch: number;
};

type ErrorShape = {
  message?: string;
  level?: number;
};

type InfoShape = {
  message: string;
};

type SuccessShape = {
  message: string;
};

type DebugShape = {
  message: string | object;
};

type WarnShape = {
  message: string | object;
  level: number | string;
};

type BodyShape = {
  type: 'error' | 'info' | 'debug' | 'warn' | 'success';
  time: { locale: string; epoch: number };
  data: ErrorShape | InfoShape | DebugShape | WarnShape;
};

const log = async (data: BodyShape) => {
  try {
    await fetch(`http://localhost:3001/logger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.API_KEY}`,
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
  }
};

const timeNow: TimeShape = {
  locale: new Date(Date.now()).toLocaleString(),
  epoch: Date.now(),
};

export const logger = {
  error: async function (message: string, loggedObj: ErrorShape) {
    loggedObj.message = message;
    await log({ type: 'error', time: timeNow, data: loggedObj });
  },

  info: async function (loggedStr: string) {
    const loggedObj: InfoShape = { message: loggedStr };
    await log({ type: 'info', time: timeNow, data: loggedObj });
  },

  success: async function (loggedStr: string) {
    const loggedObj: SuccessShape = { message: loggedStr };
    await log({ type: 'success', time: timeNow, data: loggedObj });
  },

  debug: async function (loggedStr: string | object) {
    const loggedObj: DebugShape = { message: loggedStr };
    await log({ type: 'debug', time: timeNow, data: loggedObj });
  },

  warn: async function (loggedStr: string | object, level: number | string) {
    const loggedObj: WarnShape = { message: loggedStr, level: level };
    await log({ type: 'warn', time: timeNow, data: loggedObj });
  },
};

const config = {
  logFile: {
    format: 'styled',
    enabled: true,
    fileName: 'app.log',
    location: './',
    timeType: 'epoch',
    colorizeStyledLog: false,
  },
  console: {
    format: 'styled',
    enabled: true,
    timeType: 'locale',
    colorizeStyledLog: true,
  },
};

export function validateApiKey(req:Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.API_KEY;
}

export async function LogReceiver(req:Request) {
  if (!validateApiKey(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const loggerConfigPath = path.join(process.cwd(), 'l2r.config.json');
  const loggerConfig = JSON.parse(await fs.readFile(loggerConfigPath, 'utf-8')) || config;
  const colorMap: { [key: string]: (text: string) => string } = {
    error: chalk.bgRedBright,
    info: chalk.blueBright,
    debug: chalk.yellow,
    success: chalk.greenBright,
  };

  try {
    const body = await req.json();
    const eventType = (colorMap[body.type] || chalk.greenBright)(body.type.toUpperCase());

    const colorizedLocaleStr = `[${chalk.cyan(body.time.locale.split(', ')[0])}, ${chalk.cyan(body.time.locale.split(', ')[1])}] ${eventType} - ${
      body.data.message
    }`;
    const formattedLocaleStr = `[${body.time.locale}] ${body.type.toUpperCase()} - ${body.data.message}`;
    const colorizedEpochStr = `[${chalk.cyan(body.time.epoch)}] ${eventType} - ${body.data.message}`;
    const formattedEpochStr = `[${body.time.epoch}] ${body.type.toUpperCase()} - ${body.data.message}`;

    if (loggerConfig.logFile.enabled) {
      if (loggerConfig.logFile.format === 'ndjson'.toLocaleLowerCase()) {
        const ndJsonStr = JSON.stringify(body);
        appendFile(`${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`, ndJsonStr + '\n', (err) => {
          if (err) throw err;
        });
      } else {
        appendFile(
          `${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`,
          loggerConfig.logFile.colorizeStyledLog
            ? body.time.type === 'epoch'
              ? colorizedEpochStr + '\n'
              : formattedEpochStr + '\n'
            : body.time.type === 'locale'
            ? colorizedLocaleStr + '\n'
            : formattedLocaleStr + '\n',
          (err) => {
            if (err) throw err;
          }
        );
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
    return Response.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ status: 500, error: 'Internal Server Error' });
  }
}
