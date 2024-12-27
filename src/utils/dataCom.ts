import { BodyShape } from 'src/types/types';
import serverConfig from 'src/config/serverConfig';
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

async function getConfigContents(): Promise<any> {
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
    return json;
  } catch (err) {
    console.error(err);
    return {};
  }
}

export { log, getConfigContents };
