import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });
const CACHE_KEY = "loggerConfig";

export default async function getConfigContents(): Promise<any> {
    const location =
      typeof window !== "undefined"
        ? window.location.href
        : "http://localhost:3000/";


  const cachedData = cache.get(CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  try {
    const res = await fetch(`${location}logger`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    cache.set(CACHE_KEY, json); // Cache the data
    return json;
  } catch (err) {
    console.error(err);
    return {};
  }
}
