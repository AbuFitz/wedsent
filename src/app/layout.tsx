import type { Metadata } from "next";
import "./globals.css";
import "./v2.css";
import "./faq.css";
import "./theme-v5.css";
import "./design-v6.css";
import "./product-v7.css";
import "./wedsent-home.css";
export const metadata: Metadata = {title: "Wedsent — An invite worth opening", description: "Beautiful digital wedding invitations. Make it yours, share the moment, keep everyone in the loop."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
