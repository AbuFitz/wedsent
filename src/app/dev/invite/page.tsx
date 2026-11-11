"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Invitation } from "@/components/invitation/invitation";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById } from "@/engine/registry";

function Inner() {
  const q = useSearchParams();
  const spec = specById(q.get("d") ?? "pearl");
  const data = { ...sampleData(spec, q.get("p") ?? ""), countdown: { enabled: true, style: (q.get("c") ?? "type") as "type", accent: "", label: "" }, rsvpBy: "2027-05-01", dress: "Black tie, florals welcome", date: "2027-06-12", time: "11:00", names: q.get("n") ?? spec.sample.names };
  return <div style={{ position: "fixed", inset: 0 }}><Invitation data={data} events={sampleEvents(spec)} rsvpHref="/rsvp" open={q.get("open") === "1" ? true : undefined} /></div>;
}
export default function Page() { return <Suspense><Inner /></Suspense>; }
