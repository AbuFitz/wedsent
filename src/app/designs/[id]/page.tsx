import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESIGNS, specById } from "@/engine/registry";
import { DesignDetail } from "@/components/gallery/design-detail";

type P = { params: Promise<{ id: string }>; searchParams: Promise<{ p?: string }> };
export function generateStaticParams() { return DESIGNS.map((d) => ({ id: d.id })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  const d = DESIGNS.find((x) => x.id === id);
  return d ? { title: `${d.name} | Wedsent designs`, description: d.blurb } : { title: "Design" };
}
export default async function Page({ params, searchParams }: P) {
  const id = (await params).id;
  if (!DESIGNS.some((d) => d.id === id)) notFound();
  return <DesignDetail id={specById(id).id} palette={(await searchParams).p} />;
}
