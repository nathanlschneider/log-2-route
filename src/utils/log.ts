import type { BodyShape } from "../l2rTypes/l2rTypes";
import os from "node:os";
const log = async (data: BodyShape) => {

  try {
    await fetch(`${os.hostname()}/logger`, {
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
