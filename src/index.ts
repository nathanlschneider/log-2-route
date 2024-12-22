import {
  BodyShape,
  ConfigShape,
  DebugShape,
  ErrorShape,
  InfoShape,
  SuccessShape,
  WarnShape,
} from '../src/types/types';
import defaultConfig from './utils/defaultConfig';
import timeNow from './utils/timeNow';
import { altChalk, colorMap } from './utils/altChalk';
import { log, getConfigContents } from './utils/dataCom';

export { altChalk };
export { ConfigShape}

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
  let loggerConfig: {
    logFile: { enabled: boolean; format: string; colorizeStyledLog: boolean };
    console: {
      enabled: boolean;
      format: string;
      colorizeStyledLog: boolean;
      timeType: string;
    };
  };
  let send = { logData: '', error: '' };

  const configFileContent = await getConfigContents();

  if (configFileContent === '') {
    loggerConfig = defaultConfig;
  } else {
    loggerConfig = configFileContent as {
      logFile: { enabled: boolean; format: string; colorizeStyledLog: boolean };
      console: {
        enabled: boolean;
        format: string;
        colorizeStyledLog: boolean;
        timeType: string;
      };
    };
  }

  const body: BodyShape = await req.json();

  if (!body.type || !body.time.epoch || !body.time.locale || !body.data) {
    return new Response(JSON.stringify({ error: 'Invalid log' }), {
      status: 400,
    });
  }

  try {
    const logData = (
      body: BodyShape,
      format: string,
      colorize: boolean,
      timeType: string
    ): string => {
      const eventType = (colorMap[body.type] || altChalk.green)(
        body.type.toUpperCase()
      );
      const localeParts = body.time.locale.split(', ');
      const colorizedLocaleStr = `[${altChalk.cyan(
        localeParts[0]
      )}, ${altChalk.cyan(localeParts[1])}] ${eventType} - ${
        'message' in body.data ? body.data.message : ''
      }`;
      const formattedLocaleStr = `[${
        body.time.locale
      }] ${body.type.toUpperCase()} - ${
        'message' in body.data ? body.data.message : ''
      }`;
      const colorizedEpochStr = `[${altChalk.cyan(
        body.time.epoch.toString()
      )}] ${eventType} - ${'message' in body.data ? body.data.message : ''}`;
      const formattedEpochStr = `[${
        body.time.epoch
      }] ${body.type.toUpperCase()} - ${
        'message' in body.data ? body.data.message : ''
      }`;

      if (format === 'ndjson') {
        return JSON.stringify(body);
      }
      if (colorize) {
        return timeType === 'epoch' ? colorizedEpochStr : colorizedLocaleStr;
      }
      return timeType === 'locale' ? formattedLocaleStr : formattedEpochStr;
    };

    if (loggerConfig?.logFile.enabled) {
      send.logData = logData(
        body,
        loggerConfig.logFile.format.toLowerCase(),
        loggerConfig.logFile.colorizeStyledLog,
        loggerConfig.console.timeType
      );
    }

    if (loggerConfig?.console.enabled) {
      console.log(
        logData(
          body,
          loggerConfig.console.format.toLowerCase(),
          loggerConfig.console.colorizeStyledLog,
          loggerConfig.console.timeType
        )
      );
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
