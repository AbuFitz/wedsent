import type { Metadata } from "next";
import "./globals.css";
import "./product-v7.css";
import "./weddsent-reset.css";

export const metadata: Metadata = {
  title: "Weddsent — An invitation worth opening",
  description: "Beautiful mobile-first digital wedding invitations with thoughtful RSVP and multi-event support."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
