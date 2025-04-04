import type { ConfigShape }  from "../l2rTypes/l2rTypes";

const defaultConfig: ConfigShape = {
  logFile: {
    format: 'ndjson',
    enabled: true,
    timeType: 'timestamp',
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
