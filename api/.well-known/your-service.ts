// src/api/.well-known/your-service.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { callbackUrl, siteId, userId, token } = await req.json();

  try {
    // Your logic to verify the JWT and forward the data to the callback URL
    console.log("Verification request received:", { siteId, userId, token });

    // Send a request to the callback URL to continue the verification process
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, userId, token }),
    });

    if (!response.ok) {
      throw new Error("Callback verification failed");
    }

    return NextResponse.json({
      message: "Verification request successfully processed",
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
