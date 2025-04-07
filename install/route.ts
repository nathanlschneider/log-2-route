import { LogReceiver } from "error-aware_client";
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

export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    if (!date || !/^\d{8}$/.test(date)) {
      return new Response('Invalid date format. Use MMDDYYYY', { status: 400 });
    }

    const logPath = `${home}/errorlogs/app/${date}.log`;

    try {
      const logContent = await fs.readFile(logPath, 'utf-8');
      return new Response(logContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (error) {
      return new Response('Log file not found', { status: 404 });
    }
  } catch (error) {
    console.log(`Failed to process request: ${(error as Error).message}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
