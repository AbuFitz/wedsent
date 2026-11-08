"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Invitation } from "@/components/invitation/invitation";
import { DESIGNS } from "@/engine/registry";
import { defaults, type InviteData } from "@/lib/designs";

const events = [
  { id: "1", title: "Nikah", startsOn: "2027-06-12", startsAt: "11:00", venue: "Central Mosque", city: "London" },
  { id: "2", title: "Walima", startsOn: "2027-06-12", startsAt: "18:30", venue: "The Glasshouse", city: "London" },
];
function View() {
  const q = useSearchParams();
  const only = q.get("d"); const pal = q.get("p") ?? ""; const mode = q.get("m") ?? "both";
  const list = DESIGNS.filter((d) => !only || d.id === only);
  return (
    <main style={{ padding: 20, background: "#d8d6d0", minHeight: "100vh" }}>
      {list.map((d) => {
        const data: InviteData = { ...defaults, design: d.id, names: d.sample.names, occasion: d.sample.occasion, palette: pal };
        return (
          <section key={d.id} style={{ marginBottom: 28 }}>
            <h3 style={{ font: "600 16px system-ui", margin: "0 0 8px" }}>{d.name} <small style={{ fontWeight: 400 }}>{d.opening.kind} · {d.layout}</small></h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {(mode === "both" || mode === "cover") && <div style={{ width: 300, aspectRatio: "390/830", borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}><Invitation data={data} still /></div>}
              {(mode === "both" || mode === "inside") && <div style={{ width: 300, aspectRatio: "390/830", borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}><Invitation data={data} open events={events} greeting="The Khans" /></div>}
            </div>
          </section>
        );
      })}
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><View /></Suspense>; }
