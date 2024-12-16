import { ConfigShape } from "../Types";
import flattenJSON from "./flattenJSON";

export default async function validateConfigShape(config: ConfigShape, loggerFileConfig: ConfigShape): Promise<boolean> {
    const configKeys = Object.keys(flattenJSON(config));
    const loggerConfigKeys = Object.keys(flattenJSON(loggerFileConfig));
  
    return configKeys.every(key => loggerConfigKeys.includes(key));
  }