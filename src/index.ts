"user server";

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
  type: "error" | "info" | "debug" | "warn" | "success";
  time: { locale: string; epoch: number };
  data: ErrorShape | InfoShape | DebugShape | WarnShape;
};

const log = async (data: BodyShape) => {
  try {
    await fetch(`http://localhost:3001/node_modules/log-to-route/app/logger/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
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
    await log({ type: "error", time: timeNow, data: loggedObj });
  },

  info: async function (loggedStr: string) {
    const loggedObj: InfoShape = { message: loggedStr };
    await log({ type: "info", time: timeNow, data: loggedObj });
  },
  
  success: async function (loggedStr: string) {
    const loggedObj: SuccessShape = { message: loggedStr };
    await log({ type: "success", time: timeNow, data: loggedObj });
  },

  debug: async function (loggedStr: string | object) {
    const loggedObj: DebugShape = { message: loggedStr };
    await log({ type: "debug", time: timeNow, data: loggedObj });
  },

  warn: async function (loggedStr: string | object, level: number | string) {
    const loggedObj: WarnShape = { message: loggedStr, level: level };
    await log({ type: "warn", time: timeNow, data: loggedObj });
  },

};
