import type {
  BodyShape,
  ConfigShape,
  Send,
  LogDataShape,
} from "./l2rTypes/l2rTypes";
import defaultConfig from "./utils/defaultConfig";
import { log } from "./utils/dataCom";
import { colorMap } from "./utils/colorMap";
import ansi from "micro-ansi";
import combineMessage from "./utils/combineMessage";

export const logger = {
  error: function (...args: any[]) {
    try {
      log({ type: "error", time: Date.now(), msg: combineMessage(...args) });
    } catch (err) {
      console.error("Failed to log error:", err);
    }
    return this;
  },

  info: function (...args: any[]) {
    try {
      log({ type: "info", time: Date.now(), msg: combineMessage(...args) });
    } catch (err) {
      console.error("Failed to log info:", err);
    }
    return this;
  },

  success: function (...args: any[]) {
    try {
      log({ type: "success", time: Date.now(), msg: combineMessage(...args) });
    } catch (err) {
      console.error("Failed to log success:", err);
    }
    return this;
  },

  debug: function (...args: any[]) {
    try {
      log({ type: "debug", time: Date.now(), msg: combineMessage(...args) });
    } catch (err) {
      console.error("Failed to log debug:", err);
    }
    return this;
  },

  warn: function (...args: any[]) {
    try {
      log({ type: "warn", time: Date.now(), msg: combineMessage(...args) });
    } catch (err) {
      console.error("Failed to log warn:", err);
    }
    return this;
  },
};

export function validateRequest(req: Request): void {
  if (!req) {
    throw new Error("Request object is missing");
  }
}
444;
async function parseRequestBody(req: Request): Promise<BodyShape> {
  const body: BodyShape = await req.json();
  if (!body.type || !body.msg) {
    throw new Error("Invalid log");
  }
  return body;
}

function formatLogData(
  { body, format, colorize, timeType }: LogDataShape,
  loggerConfig: ConfigShape
): string {
  const eventType = (colorMap[body.type] || ansi.green)(
    body.type.toUpperCase()
  );
  const message = body.msg;

  let formattedStr = "";
  let colorizedStr = "";

  switch (timeType) {
    case "locale":
      const localeParts = new Date(body.time).toLocaleString().split(", ");
      formattedStr = `[${new Date(
        body.time
      ).toLocaleString()}] ${body.type.toUpperCase()} - ${message}`;
      colorizedStr = `[${ansi.cyan(localeParts[0])}, ${ansi.cyan(
        localeParts[1]
      )}] ${eventType} - ${message}`;
      break;
    case "epoch":
      formattedStr = `[${body.time}] ${body.type.toUpperCase()} ${message}`;
      colorizedStr = `[${ansi.cyan(
        body.time.toString()
      )}] ${eventType} ${message}`;
      break;
    case "timestamp":
      formattedStr = `[${new Date(
        body.time
      ).toISOString()}] ${body.type.toUpperCase()} ${message}`;
      colorizedStr = `[${ansi.cyan(
        new Date(body.time).toISOString()
      )}] ${eventType} ${message}`;
      break;
    case "none":
      formattedStr = ` ${body.type.toUpperCase()} ${message}`;
      colorizedStr = ` ${eventType} ${message}`;
      break;
    default:
      throw new Error("Invalid timeType");
  }

  if (format === "ndjson") {
    body.time =
      loggerConfig.logFile.timeType === "locale"
        ? new Date(body.time).toLocaleString()
        : loggerConfig.logFile.timeType === "epoch"
        ? body.time
        : new Date(body.time).toISOString();
    return JSON.stringify(body);
  }

  return format === "styled" && colorize ? colorizedStr : formattedStr;
}

async function handleLogFile(
  body: BodyShape,
  loggerConfig: ConfigShape
): Promise<string> {
  if (loggerConfig.logFile.enabled) {
    return formatLogData(
      {
        body,
        format: loggerConfig.logFile.format.toLowerCase(),
        colorize: loggerConfig.logFile.colorizeStyledLog,
        timeType: loggerConfig.logFile.timeType,
      },
      loggerConfig
    );
  }
  return "";
}

function handleConsoleLog(body: BodyShape, loggerConfig: ConfigShape): void {
  if (
    body.type !== "debug" &&
    loggerConfig.console.enabled &&
    process.env.NODE_ENV === "development"
  ) {
    console.log(
      formatLogData(
        {
          body,
          format: loggerConfig.console.format.toLowerCase(),
          colorize: loggerConfig.console.colorizeStyledLog,
          timeType: loggerConfig.console.timeType,
        },
        loggerConfig
      )
    );
  }
}

export async function LogReceiver(req: Request): Promise<Response> {
  try {
    validateRequest(req);

    const loggerConfig = defaultConfig;
    const body = await parseRequestBody(req);

    const logData = await handleLogFile(body, loggerConfig);
    handleConsoleLog(body, loggerConfig);

    const send: Send = { logData, error: "" };

    return new Response(JSON.stringify(send), {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.error("Error occurred in LogReceiver:", error);
    return new Response(
      JSON.stringify({ status: 500, error: (error as Error).message }),
      { status: 500 }
    );
  }
}
