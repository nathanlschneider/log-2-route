import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import * as fs from "fs";


export async function GET(req: NextRequest): Promise<Response> {
  // Constants
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const MAX_REQUESTS = 100;
  const MAX_BODY_SIZE = 1024 * 1024; // 1MB
  const TIMEOUT = 5000; // 5 seconds
  const EXPECTED_ORIGIN_HEADER = "qwerkly-platform";



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
    const signature = crypto.sign("RSA-SHA256", Buffer.from(data), privateKey);
    return signature.toString("base64");
  }

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
        date,
      };

      // Sign the payload
      const signature = signPayload(responsePayload);

      // Return signed response
      return NextResponse.json(
        {
          success: true,
          payload: responsePayload,
          signature,
          requestId,
        },
        {
          status: 200,
          headers: {
            "X-Request-ID": requestId,
            "Content-Type": "application/json",
            "X-Signature-Type": "RSA-SHA256",
          },
        }
      );
    } catch (error) {
      console.log(error);
      return createErrorResponse("Log file not found", 404);
    }
  } catch (error) {
    console.error(`Failed to process request: ${(error as Error).message}`);
    return createErrorResponse("Internal Server Error", 500);
  }
}
      

