import { BodyShape } from 'src/types/types';
import serverConfig from 'src/config/serverConfig';

const log = async (data: BodyShape) => {
  try {
    await fetch(
      `http://${serverConfig.development.serverOptions.host}:${serverConfig.development.serverOptions.port}/logger`,
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

async function getConfigContents() {
  try {
    const res = await fetch(
      `http://${serverConfig.development.serverOptions.host}:${serverConfig.development.serverOptions.port}/logger`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const json = await res.json();

    return json;
  } catch (err) {
    console.error(err);
  }
}
export { log, getConfigContents };
