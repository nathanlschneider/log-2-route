import { logger } from "..";

const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  try {
    logger.info(args.join(" "));
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error(String(e));
    }
  }
};

console.error = (...args) => {
  originalError(...args);
  try {
    logger.error(args.join(" "));
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error(String(e));
    }
  }
};
