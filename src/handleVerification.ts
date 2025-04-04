// npm package: src/handleVerification.ts

import type { NextApiRequest, NextApiResponse } from "next";

export function handleVerificationRequest() {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { callbackUrl, siteId, userId, token } = req.body;

    if (!callbackUrl || !siteId || !userId || !token) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const response = await fetch(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          userId,
          siteUrl: req.headers.host,
          verificationToken: token,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send verification: ${response.status}`);
      }

      return res.status(200).json({ message: "Verification sent" });
    } catch (error) {
      console.error("Verification POST failed:", error);
      return res.status(500).json({ error: "Callback failed" });
    }
  };
}
