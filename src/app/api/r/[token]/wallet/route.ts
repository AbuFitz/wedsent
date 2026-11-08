import { NextResponse, type NextRequest } from "next/server";
import { createGoogleWalletSaveUrl, googleWalletEnabled } from "@/server/google-wallet";

export const runtime = "nodejs";
export async function GET(_req: NextRequest, context: { params: Promise<{ token: string }> }) {
  if (!googleWalletEnabled()) return NextResponse.json({ error: "Wallet issuance is not configured" }, { status: 503 });
  const { token } = await context.params;
  try {
    const url = await createGoogleWalletSaveUrl(token);
    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to issue a pass for this invitation" }, { status: 404 });
  }
}
