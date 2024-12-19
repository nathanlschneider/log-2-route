export type TimeShape = {
  locale: string;
  epoch: number;
};

export type ErrorShape = {
  message?: string;
  level?: number;
};

export type InfoShape = {
  message?: string;
  level?: number;
};

export type SuccessShape = {
  message?: string;
  level?: number;
};

export type DebugShape = {
  message?: string;
  level?: number;
};

export type WarnShape = {
  message?: string;
  level?: number;
};

export type BodyShape = {
  type: 'error' | 'info' | 'debug' | 'warn' | 'success';
  time: { locale: string; epoch: number };
  data: InfoShape  | ErrorShape | DebugShape | WarnShape | SuccessShape | TimeShape;
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

