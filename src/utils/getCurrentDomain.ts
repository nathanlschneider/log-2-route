"use server";

import { headers } from "next/headers";

export async function getCurrentDomain() {
  const headersList = await headers(); // Await the resolution of the promise
  const host = headersList.get("host");

  return host;
}