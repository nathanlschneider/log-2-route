import type { BodyShape } from "../l2rTypes/l2rTypes";
import fs from "fs";
const logWriter = async (data: BodyShape) => {
 

  const home = process.cwd();

  const system = data.system;

  await fs.promises.mkdir(`${home}/errorlogs/${system}`, { recursive: true });

  const currentDate = new Date();
  const formattedDate = `${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")}${currentDate.getFullYear()}`;

  await fs.promises.appendFile(
    `${home}/errorlogs/${system}/${formattedDate}.log`,
    data + "\n"
  );
};

export default logWriter;
