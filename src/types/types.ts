export type TimeShape = {
  time: number;
};

export type ErrorShape = {
  message: string;
};

export type InfoShape = {
  message: string;
};

export type SuccessShape = {
  message: string;
};

export type DebugShape = {
  message: string;
};

export type WarnShape = {
  message: string;
};

export type BodyShape = {
  type: 'error' | 'info' | 'debug' | 'warn' | 'success';
  time: number | string;
  data:
    | InfoShape
    | ErrorShape
    | DebugShape
    | WarnShape
    | SuccessShape
    | TimeShape;
};

export type ConfigShape = {
  serverOptions: {
    port: number;
    host: string;
  };
  logFile: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    fileName: string;
    location: string;
    timeType: 'locale' | 'epoch' | 'timestamp';
    colorizeStyledLog: boolean;
  };
  console: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    timeType: 'locale' | 'epoch' | 'timestamp';
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