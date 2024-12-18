export type TimeShape = {
  locale: string;
  epoch: number;
};

export type ErrorShape = {
  message?: string;
  level?: number;
};

export type InfoShape = {
  message: string;
};

export type SuccessShape = {
  message: string;
};

export type DebugShape = {
  message: string | object;
};

export type WarnShape = {
  message: string | object;
  level: number | string;
};

export type BodyShape = {
  type: 'error' | 'info' | 'debug' | 'warn' | 'success';
  time: { locale: string; epoch: number };
  data: ErrorShape | InfoShape | DebugShape | WarnShape;
};

export type ConfigShape = {
  logFile: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    fileName: string;
    location: string;
    timeType: 'locale' | 'epoch';
    colorizeStyledLog: boolean;
  };
  console: {
    format: 'styled' | 'ndjson';
    enabled: boolean;
    timeType: 'locale' | 'epoch';
    colorizeStyledLog: boolean;
  };
};

