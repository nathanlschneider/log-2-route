import type {
  BodyShape,
  ConfigShape,
  Send,
  LogDataShape,
} from "./l2rTypes/l2rTypes";
import defaultConfig from "./utils/defaultConfig";
import { log, getConfigContents } from "./utils/dataCom";
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

export async function getLoggerConfig(): Promise<ConfigShape> {
  try {
    const configFileContent = await getConfigContents();
    return configFileContent !== ""
      ? (configFileContent as ConfigShape)
      : defaultConfig;
  } catch (error) {
    console.error("Failed to get logger config:", error);
    return defaultConfig;
  }
}

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

    const loggerConfig = await getLoggerConfig();
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

const codes = [
  "29bd2603-f930-408b-a8be-f523430df392",
  "1bd38e8b-2abb-4d9b-a03f-4968a0d06f51",
  "b9f24aaa-4e3b-4026-bf0c-e7f0a6422972",
  "17cf416d-03d8-4bce-a837-26a2a4ba323e",
  "77d2a604-432d-42bb-94e6-77b414b88756",
  "034b7943-00d1-44f7-a948-98cc4591fad0",
  "cc1df670-36cc-44f8-81be-0686c3cd532e",
  "19ea3146-e63b-4008-b5c2-1a6b53988bbb",
  "d3c2b7af-a70c-4578-86dc-9f486986e774",
  "90882724-c4a9-4f9a-b790-4cb3f8c34583",
  "f4ddba68-4dd7-41e7-82ca-5855b98e419d",
  "14bf1553-c665-4345-a346-abf15b059ec0",
  "48e2bfbb-ad26-4883-b8fd-9c9a0eab9d12",
  "ae2cf9d7-b0eb-4397-84af-447643a7ab03",
  "31d45592-ce09-4b83-a5d1-712d11e4dbc8",
  "74fba3c9-9678-461a-9ef7-0ea88dd30998",
  "95d8ddac-fab6-4e30-a5fe-d76443c2c933",
  "72be516f-e0c7-47a4-bc1a-a634668eedcc",
  "ac6056f5-d710-4f4f-878a-2ef456e5c6e9",
  "26b2f240-806e-4def-b0f9-0a56885aad8a",
  "4618cbe0-21f4-429c-afae-8f75f5d4c2cb",
  "d570d1b0-9358-4364-b8d0-4be2d02cd65c",
  "7d72f927-ca20-4b45-9eae-7aec129c2864",
  "18411d97-1dce-43cf-b48c-21dfb391a506",
  "fe4681f5-95eb-415f-9085-d39003f42038",
  "340ec93b-05fb-41af-bcce-5b1123cb7aeb",
  "36afb467-0604-4702-bd9f-3de4b875f530",
  "83ef600a-08d0-46b0-a919-b5ca1cc3cdef",
  "3cf4c413-ef7b-4997-a4df-009c9adf1b96",
  "dc909ed1-c3a5-4046-8c1a-af53f606f280",
  "59cd9193-3c80-469a-818a-2d80af4691e4",
  "54ee925a-24f4-4404-a8f9-e0a90c2a242b",
  "7e468a4a-3cc6-42db-aff8-eb167499d26f",
  "d96ceae0-dfdf-41f0-b65b-02dd99c54d4e",
  "f310250b-9ad0-4192-8a57-4a270a31b787",
  "6053295c-0b92-4fe6-8bc9-1ea154927745",
  "35c99f3a-5982-4cd8-85d6-10ecef31f3a9",
  "19a146f0-3ca9-4b8f-99c3-6d2685b53932",
  "282a0b81-35ea-47b3-a2f3-c7da258dcc3f",
  "a0411410-cbc5-424f-a6c8-e263cec6ff63",
  "8f2e4be5-4188-4a00-8597-3116ccb5e848",
  "2500d83b-497c-4734-a5ad-4816ffe6596f",
  "3ff24f35-0f62-45fc-a0dd-e65e9c0696c5",
  "9544c9bb-a296-400b-a42f-470ef1988e42",
  "8320f3bc-6441-4e1d-9df4-2a98f7e8ddcf",
  "f662ffa4-67dc-45a2-af34-6909e2b1dc7e",
  "bf2f920c-30ab-435e-870b-707ff888044a",
  "420b5f7a-33f3-4ab2-be27-ceb311f1c7b4",
  "747ed59e-86a2-4e7a-8a9b-4b7b90c8daee",
  "4314c7ff-51c6-4e7c-9b88-a780af53b4a5",
];
