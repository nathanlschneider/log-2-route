export type TimeShape = {
  locale: string;
  epoch: number;
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
  time: { locale: string; epoch: number };
  data:
    | InfoShape
    | ErrorShape
    | DebugShape
    | WarnShape
    | SuccessShape
    | TimeShape;
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

export type BodyConfig = {
  type: string;
  time: { locale: string; epoch: number };
  data: InfoShape;
};
