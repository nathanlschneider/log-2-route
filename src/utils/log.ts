import type { BodyShape } from '../l2rTypes/l2rTypes';
import serverConfig from '../config/serverConfig';
const serverUrl =
  process.env.NODE_ENV === 'production'
    ? serverConfig.production
    : serverConfig.development;

const log = async (data: BodyShape) => {
  try {
    await fetch(
      `http://${serverUrl.serverOptions.host}:${serverUrl.serverOptions.port}/logger`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export default log;