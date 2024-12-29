import {
  BodyShape,
  ConfigShape,
  DebugShape,
  ErrorShape,
  InfoShape,
  Send,
  SuccessShape,
  WarnShape,
} from '@typesFiles/types';
import defaultConfig from '@utils/defaultConfig';
import { log, getConfigContents } from '@utils/dataCom';
import { colorMap } from '@utils/colorMap';
import ansi from 'micro-ansi';
import combineMessage from '@utils/combineMessage';
export { ConfigShape };

export const logger = {
  error: async function (...args: any[]) {
    const loggedError: ErrorShape = { message: combineMessage(...args) };
    try {
      await log({ type: 'error', time: Date.now(), data: loggedError });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
    return this;
  },

  info: async function (...args: any[]) {
    const loggedInfo: InfoShape = { message: combineMessage(...args) };
    try {
      await log({ type: 'info', time: Date.now(), data: loggedInfo });
    } catch (err) {
      console.error('Failed to log info:', err);
    }
    return this;
  },

  success: async function (...args: any[]) {
    const loggedSuccess: SuccessShape = { message: combineMessage(...args) };
    try {
      await log({ type: 'success', time: Date.now(), data: loggedSuccess });
    } catch (err) {
      console.error('Failed to log success:', err);
    }
    return this;
  },

  debug: async function (...args: any[]) {
    const loggedDebug: DebugShape = { message: combineMessage(...args) };
    try {
      await log({ type: 'debug', time: Date.now(), data: loggedDebug });
    } catch (err) {
      console.error('Failed to log debug:', err);
    }
    return this;
  },

  warn: async function (...args: any[]) {
    const loggedWarn: WarnShape = { message: combineMessage(...args) };
    try {
      await log({ type: 'warn', time: Date.now(), data: loggedWarn });
    } catch (err) {
      console.error('Failed to log warn:', err);
    }
    return this;
  },
};

export async function LogReceiver(req: Request): Promise<Response> {
  try {
    if (!req) {
      throw new Error('Request object is missing');
    }
    let loggerConfig: {
      logFile: {
        enabled: boolean;
        format: string;
        colorizeStyledLog: boolean;
        timeType: string;
      };
      console: {
        enabled: boolean;
        format: string;
        colorizeStyledLog: boolean;
        timeType: string;
      };
    };
    let send:Send = { logData: '', error: '' };

    const configFileContent = await getConfigContents();

    if (configFileContent === '') {
      loggerConfig = defaultConfig;
    } else {
      loggerConfig = configFileContent as {
        logFile: {
          enabled: boolean;
          format: string;
          colorizeStyledLog: boolean;
          timeType: string;
        };
        console: {
          enabled: boolean;
          format: string;
          colorizeStyledLog: boolean;
          timeType: string;
        };
      };
    }

    const body: BodyShape = await req.json();

    if (!body.type || !body.data) {
      return new Response(JSON.stringify({ error: 'Invalid log' }), {
        status: 400,
      });
    }
    const logData = (
      body: BodyShape,
      format: string,
      colorize: boolean,
      timeType: string
    ): string => {
      if (!body || !body.time || !body.type) {
        throw new Error('Invalid body structure');
      }

      const eventType = (colorMap[body.type] || ansi.green)(
        body.type.toUpperCase()
      );
      const message = 'message' in body.data ? body.data.message : '';

      let formattedStr = '';
      let colorizedStr = '';

      switch (timeType) {
        case 'locale':
          const localeParts = new Date(body.time).toLocaleString().split(', ');
          formattedStr = `[${new Date(
            body.time
          ).toLocaleString()}] ${body.type.toUpperCase()} - ${message}`;
          colorizedStr = `[${ansi.cyan(localeParts[0])}, ${ansi.cyan(
            localeParts[1]
          )}] ${eventType} - ${message}`;
          break;
        case 'epoch':
          formattedStr = `[${
            body.time
          }] ${body.type.toUpperCase()} - ${message}`;
          colorizedStr = `[${ansi.cyan(
            body.time.toString()
          )}] ${eventType} - ${message}`;
          break;
        case 'timestamp':
          formattedStr = `[${new Date(
            body.time
          ).toISOString()}] ${body.type.toUpperCase()} - ${message}`;
          colorizedStr = `[${ansi.cyan(
            new Date(body.time).toISOString()
          )}] ${eventType} - ${message}`;
          break;
        default:
          throw new Error('Invalid timeType');
      }

      if (format === 'ndjson') {
        body.time =
          loggerConfig.logFile.timeType === 'locale'
            ? new Date(body.time).toLocaleString()
            : loggerConfig.logFile.timeType === 'epoch'
            ? body.time
            : new Date(body.time).toISOString();
        return JSON.stringify(body);
      }

      if (format === 'styled' && colorize) {
        return colorizedStr;
      }
      return formattedStr;
    };

    if (loggerConfig?.logFile.enabled) {
      send.logData = logData(
        body,
        loggerConfig.logFile.format.toLowerCase(),
        loggerConfig.logFile.colorizeStyledLog,
        loggerConfig.logFile.timeType
      );
    }

    if (
      body.type !== 'debug' &&
      loggerConfig?.console.enabled &&
      process.env.NODE_ENV === 'development'
    ) {
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
      statusText: 'OK',
    });
  } catch (error) {
    console.error('Error occurred in LogReceiver:', error);
    return new Response(
      JSON.stringify({ status: 500, error: (error as Error).message }),
      { status: 500 }
    );
  }
}
