import { LogReceiver } from "log-2-route";
import { promises as fs } from "fs";

type ResJsonType = { logData: string; error?: string };

const home = process.cwd();

export async function POST(req: Request): Promise<Response> {
  try {
    const res = await LogReceiver(req);
    const resJson: ResJsonType = await res.json();

    if (resJson.error) {
      console.log(resJson.error);
      return new Response(resJson.error, { status: 400 });
    } else {
      await fs.mkdir(`${home}/errorlogs/app`, { recursive: true });

      const currentDate = new Date();
      const formattedDate = `${
        currentDate.getMonth() + 1
      }${currentDate.getDate()}${currentDate.getFullYear()}`;

      await fs.appendFile(
        `${home}/errorlogs/app/${formattedDate}.log`,
        resJson.logData + "\n"
      );

      return new Response("Log data appended successfully", { status: 200 });
    }
  } catch (error) {
    console.log(`Failed to process request: ${(error as Error).message}`);
    return new Response("Internal Server Error", { status: 500 });
  }
}
