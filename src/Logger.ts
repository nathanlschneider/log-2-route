import combineMessage from './utils/combineMessage';
import { log } from './utils/dataCom';

export default function Logger() {
 
}

Logger.prototype.error = async function (...args: any[]) {
  const loggedError = { message: combineMessage(...args) };
  try {
    await log({ type: 'error', time: Date.now(), data: loggedError });
    return this;

  } catch (err) {
    console.error('Failed to log error:', err);
  }
  return this;
};

Logger.prototype.info = async function (...args: any[]) {
  const loggedInfo = { message: combineMessage(...args) };
  try {
    await log({ type: 'info', time: Date.now(), data: loggedInfo });
    return this;

  } catch (err) {
    console.error('Failed to log info:', err);
  }
  return this;
};

Logger.prototype.success = async function (...args: any[]) {
  const loggedSuccess = { message: combineMessage(...args) };
  try {
    await log({ type: 'success', time: Date.now(), data: loggedSuccess });
    return this;

  } catch (err) {
    console.error('Failed to log success:', err);
  }
  return this;
};

Logger.prototype.debug = async function (...args: any[]) {
  const loggedDebug = { message: combineMessage(...args) };
  try {
    await log({ type: 'debug', time: Date.now(), data: loggedDebug });
    return this;

  } catch (err) {
    console.error('Failed to log debug:', err);
  }
  return this;
};

Logger.prototype.warn = async function (...args: any[]) {
  const loggedWarn = { message: combineMessage(...args) };
  try {
    await log({ type: 'warn', time: Date.now(), data: loggedWarn });
    return this;

  } catch (err) {
    console.error('Failed to log warn:', err);
  }
  return this;
};
