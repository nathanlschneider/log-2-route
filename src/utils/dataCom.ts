import { BodyShape } from 'src/types/types';

const log = async (data: BodyShape) => {
  try {
    await fetch(`${process.env.L2R_SERVER_URL}/logger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
  }
};

async function getConfigContents() {
  try {
    const res = await fetch(`${process.env.L2R_SERVER_URL}/logger`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await res.json();

    return json;
  } catch (err) {
    console.error(err);
  }
}
export { log, getConfigContents };
