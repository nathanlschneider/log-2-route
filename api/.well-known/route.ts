import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import * as fs from "fs";

const publicKey = fs.readFileSync(
  process.cwd() + "/app/logger/.well-known/public.pem",
  "utf8"
);

// Constants
// const ALLOWED_IPS = ["74.208.201.237"]; // replace with your platform's IP
const EXPECTED_ORIGIN_HEADER = "qwerkly-platform";
const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const TIMEOUT = 5000; // 5 seconds
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per window

const enum ErrorType {
  RATE_LIMIT = "Rate limit exceeded",
  INVALID_IP = "Unauthorized IP",
  INVALID_PROTOCOL = "HTTPS required",
  INVALID_ORIGIN = "Invalid origin header",
  INVALID_SIGNATURE = "Invalid signature",
  TIMEOUT = "Request timeout",
  PAYLOAD_TOO_LARGE = "Request too large",
  INVALID_JSON = "Invalid JSON payload",
  MISSING_FIELDS = "Missing payload or signature",
  INTERNAL_ERROR = "Internal server error",
  INVALID_VERIFICATION = "Invalid verification token",
  CONNECTION_ERROR = "Connection verification failed",
}

// Types
interface RequestPayload {
  payload: Record<string, unknown>; // More specific type than 'unknown'
  signature: string;
}

interface ApiResponse {
  success: boolean; // Remove the optional modifier
  error?: string;
  received?: Record<string, unknown>;
  requestId: string;
  timestamp?: number; // Add timestamp for consistency
}

interface VerificationPayload {
  verificationType: "connection";
  platformId: string;
  timestamp: number;
}

// Add type guard
function isVerificationPayload(
  payload: unknown
): payload is VerificationPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as VerificationPayload).verificationType === "connection" &&
    typeof (payload as VerificationPayload).platformId === "string" &&
    typeof (payload as VerificationPayload).timestamp === "number"
  );
}

// Rate limit data structure
const rateLimit = new Map<string, { count: number; timestamp: number }>();

// Helper functions
function verifySignature(
  payload: Record<string, unknown>,
  signature: string
): boolean {
  try {
    const data = JSON.stringify(payload);
    const sigBuffer = Buffer.from(signature, "base64");
    return crypto.verify(
      "RSA-SHA256", // Explicit algorithm instead of null
      Buffer.from(data),
      publicKey,
      sigBuffer
    );
  } catch {
    return false;
  }
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    // req.ip is not available in NextRequest
    "unknown"
  );
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

function generateRequestId(): string {
  return crypto.randomBytes(16).toString("hex");
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

// Update verifyConnectionRequest function
function verifyConnectionRequest(payload: Record<string, unknown>): boolean {
  if (!isVerificationPayload(payload)) {
    return false;
  }

  const timestampAge = Date.now() - payload.timestamp;
  return timestampAge <= 300000; // 5 minutes
}

export async function POST(req: NextRequest) {
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

  // // Existing security checks
  // if (!ALLOWED_IPS.includes(ip)) {
  //   return createErrorResponse("Unauthorized IP");
  // }

  if (req.headers.get("x-forwarded-proto") !== "https") {
    return createErrorResponse("HTTPS required");
  }

  if (req.headers.get("x-platform-origin") !== EXPECTED_ORIGIN_HEADER) {
    return createErrorResponse("Invalid origin header");
  }

  // Timeout wrapper
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(ErrorType.TIMEOUT)), TIMEOUT);
    });

    const processRequest = async (): Promise<NextResponse<ApiResponse>> => {
      // Payload validation
      let requestData: RequestPayload;
      try {
        requestData = await req.json();
      } catch {
        return createErrorResponse("Invalid JSON payload", 400);
      }

      const { payload, signature } = requestData;
      if (!payload || !signature) {
        return createErrorResponse("Missing payload or signature", 400);
      }

      if (!verifySignature(payload, signature)) {
        return createErrorResponse("Invalid signature");
      }

      // Update the verification check in POST handler
      if (payload.verificationType === "connection") {
        if (!isVerificationPayload(payload)) {
          return createErrorResponse(ErrorType.INVALID_VERIFICATION, 400);
        }

        if (!verifyConnectionRequest(payload)) {
          return createErrorResponse(ErrorType.CONNECTION_ERROR, 400);
        }

        return NextResponse.json(
          {
            success: true,
            verified: true,
            platformId: payload.platformId,
            requestId,
          },
          {
            headers: {
              "X-Request-ID": requestId,
              "X-Verification-Time": Date.now().toString(),
            },
          }
        );
      }

      // Success response
      return NextResponse.json(
        { success: true, received: payload, requestId },
        { headers: { "X-Request-ID": requestId } }
      );
    };

    const response = await Promise.race([processRequest(), timeoutPromise]);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === ErrorType.TIMEOUT) {
        return createErrorResponse(ErrorType.TIMEOUT, 408);
      }
      // Log the error message for debugging
      console.error(`Request failed: ${error.message}`);
    }
    return createErrorResponse(ErrorType.INTERNAL_ERROR, 500);
  }
}
