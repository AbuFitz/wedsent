import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/gallery";
export const metadata: Metadata = { title: "Designs | Wedsent", description: "Browse working wedding invitation designs. Open them, change the colours, make one yours." };
export default async function Page({ searchParams }: { searchParams: Promise<{ culture?: string }> }) {
  const q = await searchParams;
  return <Gallery initial={{ culture: q.culture }} />;
}
