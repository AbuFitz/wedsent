import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title: "Wedsent — An invite worth opening", description: "Beautiful digital wedding invitations. Make it yours, share the moment, keep everyone in the loop."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
