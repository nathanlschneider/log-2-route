import { ConfigShape } from '@typesFiles/types';

const defaultConfig: ConfigShape = {
  logFile: {
    format: 'ndjson',
    enabled: true,
    fileName: 'l2r.log',
    location: './',
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
