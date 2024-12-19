import { ConfigShape } from "../types/types";

const defaultConfig: ConfigShape = {
  logFile: {
    format: 'styled',
    enabled: true,
    fileName: 'app.log',
    location: './',
    timeType: 'epoch',
    colorizeStyledLog: false,
  },
  console: {
    format: 'styled',
    enabled: true,
    timeType: 'locale',
    colorizeStyledLog: true,
  },
};

export default defaultConfig;