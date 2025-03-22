import type { BodyShape } from "../l2rTypes/l2rTypes";
const log = async (data: BodyShape) => {
  const location = typeof window !== "undefined" ? window.location.href : "localhost:3000";
  console.log(location)

  try {
    await fetch(`//${location}/logger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error(err);
  }
};

export default log;
