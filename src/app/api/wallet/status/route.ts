import { NextResponse } from "next/server";
import { googleWalletEnabled } from "@/server/google-wallet";

export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({ google: googleWalletEnabled(), apple: false }, { headers: { "Cache-Control": "no-store" } });
}
