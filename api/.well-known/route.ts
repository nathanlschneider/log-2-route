import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { callbackUrl, siteId, userId, token } = await req.json();

  console.log({
    callbackUrl: callbackUrl,
    siteId: siteId,
    userId: userId,
    token: token,
  });

  try {
    console.log("Verification request received:", { siteId, userId, token });

    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, userId, token, callbackUrl }),
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
