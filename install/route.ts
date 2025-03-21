import { LogReceiver } from "log-2-route";
import ansi from "micro-ansi";
import { promises as fs } from "fs";

type ResJsonType = { logData: string; error?: string };

const configFilePath = process.cwd();
let configFileContentStr: string;

async function loadConfig() {
  try {
    configFileContentStr = await fs.readFile(`${configFilePath}/l2r.config.json`, "utf-8");
    return JSON.parse(configFileContentStr);
  } catch (error) {
   console.log(ansi.red(`Failed to read config file: ${(error as Error).message}`));
    throw new Error("Configuration file read error");
  }
}

const configFileContentJson = await loadConfig();

export async function POST(req: Request): Promise<Response> {
  try {
    const res = await LogReceiver(req);
    const resJson: ResJsonType = await res.json();

    if (resJson.error) {
      console.log(ansi.red(resJson.error));
      return new Response(resJson.error, { status: 400 });
    } else {
      await fs.mkdir(`${configFilePath}/${configFileContentJson.logFile.location}`, { recursive: true });
      await fs.appendFile(`${configFilePath}/${configFileContentJson.logFile.location}/${configFileContentJson.logFile.fileName}`, resJson.logData + "\n");
      return new Response("Log data appended successfully", { status: 200 });
    }
  } catch (error) {
   console.log(ansi.red(`Failed to process request: ${(error as Error).message}`));
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  return new Response(configFileContentStr, { status: 200 });
}
