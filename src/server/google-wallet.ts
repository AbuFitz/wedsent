import { createHash, createSign } from "node:crypto";
import { guestView } from "@/server/rsvp";

/** Google Wallet classes and issuer approval are configured in Google Wallet Console. */
export function googleWalletEnabled(): boolean {
  return !!(process.env.GOOGLE_WALLET_ISSUER_ID && process.env.GOOGLE_WALLET_CLASS_ID && process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_WALLET_PRIVATE_KEY && process.env.NEXT_PUBLIC_SITE_URL);
}

const base64url = (value: string | Buffer) => Buffer.from(value).toString("base64url");

export async function createGoogleWalletSaveUrl(token: string): Promise<string> {
  if (!googleWalletEnabled()) throw new Error("Google Wallet is not configured");
  // This is the same private household view as RSVP: revoked or expired links fail.
  const view = await guestView(token);
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classId = process.env.GOOGLE_WALLET_CLASS_ID!;
  if (!classId.startsWith(`${issuerId}.`)) throw new Error("Google Wallet class does not match issuer");
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL!).origin;
  const objectKey = createHash("sha256").update(token).digest("hex").slice(0, 32);
  const names = String(view.content.names || "Wedding invitation").slice(0, 80);
  const event = view.events[0];
  const eventName = event?.title || "Celebration";
  const saveUrl = `${origin}/r/${encodeURIComponent(token)}`;
  const object = {
    id: `${issuerId}.wedsent_${objectKey}`,
    classId,
    state: "ACTIVE",
    cardTitle: { defaultValue: { language: "en-GB", value: "Wedding invitation" } },
    header: { defaultValue: { language: "en-GB", value: names } },
    subheader: { defaultValue: { language: "en-GB", value: eventName } },
    barcode: { type: "QR_CODE", value: saveUrl, alternateText: "Open your invitation" },
    hexBackgroundColor: "#F4F1EA",
    textModulesData: [
      { id: "event", header: "Occasion", body: eventName },
      ...(event?.startsOn ? [{ id: "date", header: "Date", body: event.startsOn }] : []),
      ...(event?.venue ? [{ id: "venue", header: "Venue", body: `${event.venue}${event.city ? `, ${event.city}` : ""}` }] : []),
    ],
  };
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    origins: [origin],
    payload: { genericObjects: [object] },
  }));
  const input = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(input); sign.end();
  const signature = sign.sign(process.env.GOOGLE_WALLET_PRIVATE_KEY!.replace(/\\n/g, "\n")).toString("base64url");
  return `https://pay.google.com/gp/v/save/${input}.${signature}`;
}
