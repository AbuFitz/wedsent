import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hedvig-letters-serif/index.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "@fontsource-variable/geist";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Wedsent | Wedding invitations that open",
  description: "Create a digital wedding invitation, share it with your guests and collect replies for every celebration.",
};
export const viewport: Viewport = { themeColor: "#EFEBE4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
