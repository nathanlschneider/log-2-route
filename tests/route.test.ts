import { NextRequest } from "next/server";
import { POST } from "../api/.well-known/route";
import * as crypto from "crypto";

// Mock crypto and fs modules
jest.mock("crypto");
jest.mock("fs", () => ({
  readFileSync: jest.fn().mockReturnValue("mock-public-key"),
}));

// Mock key pair for testing
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

describe("API Route Handler", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create base mock request
    mockRequest = new NextRequest("https://test.com", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-proto": "https",
        "x-platform-origin": "qwerkly-platform",
        "x-real-ip": "74.208.201.237",
      },
    });
  });

  // Test basic request validation
  test("validates content length", async () => {
    const req = new NextRequest("https://test.com", {
      method: "POST",
      headers: {
        ...mockRequest.headers,
        "content-length": (2 * 1024 * 1024).toString(), // 2MB
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(413);
  });

  test("validates IP address", async () => {
    const req = new NextRequest("https://test.com", {
      method: "POST",
      headers: {
        ...mockRequest.headers,
        "x-real-ip": "192.168.1.1",
      },
    });

    const response = await POST(req);
    expect(response.status).toBe(403);
  });

  // Test request signing
  test("validates signature", async () => {
    const payload = { test: "data" };
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(payload));
    const signature = sign.sign(privateKey, "base64");

    const req = new NextRequest("https://test.com", {
      method: "POST",
      headers: mockRequest.headers,
      body: JSON.stringify({ payload, signature }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  // Test connection verification
  test("handles connection verification", async () => {
    const payload = {
      verificationType: "connection",
      platformId: "test-platform",
      timestamp: Date.now(),
    };

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(payload));
    const signature = sign.sign(privateKey, "base64");

    const req = new NextRequest("https://test.com", {
      method: "POST",
      headers: mockRequest.headers,
      body: JSON.stringify({ payload, signature }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.verified).toBe(true);
  });

  // Test rate limiting
  test("enforces rate limits", async () => {
    const payload = { test: "data" };
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(JSON.stringify(payload));
    const signature = sign.sign(privateKey, "base64");
    const body = JSON.stringify({ payload, signature });

    // Make 101 requests (exceeding the 100 limit)
    const responses = await Promise.all(
      Array(101)
        .fill(null)
        .map(() =>
          POST(
            new NextRequest("https://test.com", {
              method: "POST",
              headers: mockRequest.headers,
              body,
            })
          )
        )
    );

    const lastResponse = responses[responses.length - 1];
    expect(lastResponse.status).toBe(429);
  });

  // Test timeout
  test("handles timeouts", async () => {
    jest.useFakeTimers();
    
    const requestPromise = POST(mockRequest);
    jest.advanceTimersByTime(6000); // Advance past 5s timeout
    
    const response = await requestPromise;
    expect(response.status).toBe(408);
    
    jest.useRealTimers();
  });

  // Test error responses
  test("includes request ID in error responses", async () => {
    const response = await POST(
      new NextRequest("https://test.com", {
        method: "POST",
        headers: {
          ...mockRequest.headers,
          "x-real-ip": "192.168.1.1",
        },
      })
    );

    const data = await response.json();
    expect(data.requestId).toBeDefined();
    expect(response.headers.get("X-Request-ID")).toBeDefined();
  });
});