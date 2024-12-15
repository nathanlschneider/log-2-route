import { NextResponse, NextRequest } from "next/server";
import { appendFile } from "node:fs";
import path from "path";
import chalk from "chalk";
import { promises as fs } from "fs";

function validateApiKey(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key");
  return apiKey === process.env.API_KEY;
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const loggerConfigPath = path.join(process.cwd(), "logger.config.json");
  const loggerConfig = JSON.parse(await fs.readFile(loggerConfigPath, "utf-8"));
  const colorMap: { [key: string]: (text: string) => string } = {
    error: chalk.bgRedBright,
    info: chalk.blueBright,
    debug: chalk.yellow,
    success: chalk.greenBright,
  };

  try {
    const body = await req.json();
    const eventType = (colorMap[body.type] || chalk.greenBright)(
      body.type.toUpperCase(),
    );

    const colorizedLocaleStr = `[${chalk.cyan(body.time.locale.split(", ")[0])}, ${chalk.cyan(body.time.locale.split(", ")[1])}] ${eventType} - ${body.data.message}`;
    const formattedLocaleStr = `[${body.time.locale}] ${body.type.toUpperCase()} - ${body.data.message}`;
    const colorizedEpochStr = `[${chalk.cyan(body.time.epoch)}] ${eventType} - ${body.data.message}`;
    const formattedEpochStr = `[${body.time.epoch}] ${body.type.toUpperCase()} - ${body.data.message}`;

    if (loggerConfig.logFile.enabled) {
      if (loggerConfig.logFile.format === "ndjson".toLocaleLowerCase()) {
        const ndJsonStr = JSON.stringify(body);
        appendFile(
          `${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`,
          ndJsonStr + "\n",
          (err) => {
            if (err) throw err;
          },
        );
      } else {
        appendFile(
          `${loggerConfig.logFile.location}/${loggerConfig.logFile.fileName}`,
          loggerConfig.logFile.colorizeStyledLog
            ? body.time.type === "epoch"
              ? colorizedEpochStr  + "\n"
              : formattedEpochStr + "\n"
            : body.time.type === "locale"
              ? colorizedLocaleStr  + "\n"
              : formattedLocaleStr + "\n",
          (err) => {
            if (err) throw err;
          },
        );
      }
    }
    if (loggerConfig.console.enabled) {
      if (loggerConfig.console.format === "ndjson".toLocaleLowerCase()) {
        const ndJsonStr = JSON.stringify(body);
        console.log(ndJsonStr);
      } else {
        console.log(
          loggerConfig.console.colorizeStyledLog
            ? loggerConfig.console.timeType === "epoch"
              ? colorizedEpochStr
              : colorizedLocaleStr
            : loggerConfig.console.timeType === "locale"
              ? formattedLocaleStr
              : formattedEpochStr,
        );
      }
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
