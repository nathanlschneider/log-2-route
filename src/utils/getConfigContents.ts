import { logger } from '..';
import serverConfig from '../config/serverConfig';
import NodeCache from 'node-cache';

const serverUrl =
  process.env.NODE_ENV === 'production'
    ? serverConfig.production
    : serverConfig.development;

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });
const CACHE_KEY = 'loggerConfig';

export default async function getConfigContents(): Promise<any> {
  const cachedData = cache.get(CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  try {
    const res = await fetch(
      `http://${serverUrl.serverOptions.host}:${serverUrl.serverOptions.port}/logger`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    logger.info('fetched logger config');
    cache.set(CACHE_KEY, json); // Cache the data
    return json;
  } catch (err) {
    console.error(err);
    return {};
  }
}
