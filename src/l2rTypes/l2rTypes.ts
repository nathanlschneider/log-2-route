export type TimeShape = {
  time: number;
};

export type ErrorShape = {
  msg: string;
};

export type InfoShape = {
  msg: string;
};

export type SuccessShape = {
  msg: string;
};

export type DebugShape = {
  msg: string;
};

export type WarnShape = {
  msg: string;
};

export type BodyShape = {
  type: 'error' | 'info' | 'debug' | 'warn' | 'success';
  time: number | string;
  msg: any;
};

export type ConfigShape = {
  logFile: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    timeType: 'locale' | 'epoch' | 'timestamp' | 'none';
    colorizeStyledLog: boolean;
  };
  console: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    timeType: 'locale' | 'epoch' | 'timestamp' | 'none';
    colorizeStyledLog: boolean;
  };
};

export type ServerConfigShape = {
  serverOptions: { port: number; host: string };
};
export interface LoggerConfig {
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
}

export interface Send {
  logData: string;
  error: string;
}

export type LogDataShape = {
  body: BodyShape;
  format: string;
  colorize: boolean;
  timeType: string;
};
