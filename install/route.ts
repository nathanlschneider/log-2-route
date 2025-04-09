import { LogReceiver } from "error-aware-client";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import * as fs from "fs";


// Constants
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;
const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const TIMEOUT = 5000; // 5 seconds
const EXPECTED_ORIGIN_HEADER = "qwerkly-platform";

// Types
interface ResJsonType {
  logData: string;
  error?: string;
}

// Rate limit data structure
const rateLimit = new Map<string, { count: number; timestamp: number }>();

// Helper functions
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function generateRequestId(): string {
  return crypto.randomBytes(16).toString("hex");
}

function createErrorResponse(message: string, status: number = 403) {
  const requestId = generateRequestId();
  return NextResponse.json(
    { success: false, error: message, requestId },
    {
      status,
      headers: { "X-Request-ID": requestId },
    }
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = rateLimit.get(ip);

  if (!requestData || now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestData.count >= MAX_REQUESTS) {
    return false;
  }

  requestData.count++;
  return true;
}

const home = process.cwd();

// Add private key loading
const privateKey = fs.readFileSync(
  process.cwd() + "/app/logger/.well-known/private.pem",
  "utf8"
);

// Add signing function
function signPayload(payload: unknown): string {
  const data = JSON.stringify(payload);
  const signature = crypto.sign(
    "RSA-SHA256",
    Buffer.from(data),
    privateKey
  );
  return signature.toString("base64");
}

export async function POST(req: NextRequest): Promise<Response> {
  // Request ID and size check
  const requestId = generateRequestId();
  if (
    req.headers.get("content-length") &&
    parseInt(req.headers.get("content-length")!) > MAX_BODY_SIZE
  ) {
    return createErrorResponse("Request too large", 413);
  }

  // Rate limiting
  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    return createErrorResponse("Rate limit exceeded", 429);
  }

  // Security checks
  if (req.headers.get("x-forwarded-proto") !== "https") {
    return createErrorResponse("HTTPS required");
  }

  if (req.headers.get("x-platform-origin") !== EXPECTED_ORIGIN_HEADER) {
    return createErrorResponse("Invalid origin header");
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), TIMEOUT);
    });

    const processRequest = async (): Promise<Response> => {
      const res = await LogReceiver(req);
      const resJson: ResJsonType = await res.json();
      const system = JSON.parse(resJson.logData).system;

      if (resJson.error) {
        return createErrorResponse(resJson.error, 400);
      }

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
        resJson.logData + "\n"
      );

      return NextResponse.json(
        { success: true, message: "Log data appended successfully", requestId },
        { 
          status: 200,
          headers: { "X-Request-ID": requestId }
        }
      );
    };

    const response = await Promise.race([processRequest(), timeoutPromise]);
    return response;
  } catch (error) {
    console.error(`Failed to process request: ${(error as Error).message}`);
    return createErrorResponse("Internal Server Error", 500);
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  // Rate limiting for GET requests
  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    return createErrorResponse("Rate limit exceeded", 429);
  }

  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const type = url.searchParams.get("type");
    const requestId = generateRequestId();

    if (!date || !/^\d{8}$/.test(date)) {
      return createErrorResponse("Invalid date format. Use MMDDYYYY", 400);
    }

    const logPath = `${home}/errorlogs/${type}/${date}.log`;

    try {
      const logContent = await fs.promises.readFile(logPath, "utf-8");
      
      // Create response payload
      const responsePayload = {
        content: logContent,
        timestamp: Date.now(),
        requestId,
        type,
        date
      };

      // Sign the payload
      const signature = signPayload(responsePayload);

      // Return signed response
      return NextResponse.json(
        {
          success: true,
          payload: responsePayload,
          signature,
          requestId
        },
        {
          status: 200,
          headers: {
            "X-Request-ID": requestId,
            "Content-Type": "application/json",
            "X-Signature-Type": "RSA-SHA256"
          }
        }
      );
    } catch (error) {
      console.log(error)
      return createErrorResponse("Log file not found", 404);
    }
  } catch (error) {
    console.error(`Failed to process request: ${(error as Error).message}`);
    return createErrorResponse("Internal Server Error", 500);
  }
}
