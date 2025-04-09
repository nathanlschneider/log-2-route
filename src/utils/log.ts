
import { getCurrentDomain } from "./getCurrentDomain";

import type { BodyShape } from "../l2rTypes/l2rTypes";
const log = async (data: BodyShape) => {
  const domain = await getCurrentDomain();
  
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";

  try {
    await fetch(`${proto}://${domain}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-platform-origin": "qwerkly-platform",
        "x-forwarded-proto": "https",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
  }
};

export default log;
