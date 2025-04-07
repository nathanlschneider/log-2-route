import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_KEY_PEM } from "./public-key";
import * as crypto from "crypto";

function verifySignature(payload: {}, signature: string): boolean {
  try {
    const data = JSON.stringify(payload);
    const sigBuffer = Buffer.from(signature, "base64");
    return crypto.verify(null, Buffer.from(data), PUBLIC_KEY_PEM, sigBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { payload, signature } = await req.json();

  if (!payload || !signature) {
    return NextResponse.json(
      { error: "Missing payload or signature" },
      { status: 400 }
    );
  }

  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  return NextResponse.json({ success: true, received: payload });
}

