"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLineUp, Sparkle, Eye, DoorOpen, FireSimple, PenNib, TextAa, Plant, Flower } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { paletteOf, type DesignSpec, type OpeningKind } from "@/engine/registry";
import { sampleData } from "./samples";

export const OPENING_ICON: Record<OpeningKind, typeof Sparkle> = { lift: ArrowLineUp, doors: DoorOpen, bloom: Sparkle, ignite: FireSimple, script: PenNib, kinetic: TextAa, grow: Plant, petals: Flower, veil: Eye, focus: Eye, curtain: Eye };
export const OPENING_NAME: Record<OpeningKind, string> = { lift: "Lifts away", doors: "Opens from the middle", bloom: "Opens from your touch", ignite: "Foil draws in", script: "Written in ink", kinetic: "Type rises", grow: "Botanicals grow", petals: "Petals fall", veil: "Soft reveal", focus: "Soft reveal", curtain: "Opens from the middle" };

/** One design as a product shot: its real cover on a stage tinted to its own palette. */
export function DesignCard({ spec, href, names }: { spec: DesignSpec; href?: string; names?: string }) {
  const [pal, setPal] = useState(spec.palettes[0].id);
  const Icon = OPENING_ICON[spec.opening.kind];
  const to = href ?? `/designs/${spec.id}?p=${pal}`;
  const p = paletteOf(spec, pal);
  return (
    <article className="ws-card">
      <div className="ws-card-stage" style={{ ["--stage" as string]: `color-mix(in srgb, ${p.bg ?? spec.site.bg} 45%, #cdc5b8)` }}>
        <Link href={to} className="ws-card-hit" aria-label={`Preview ${spec.name}`} />
        <div className="ws-card-shot" inert aria-hidden="true"><Invitation data={{ ...sampleData(spec, pal), ...(names ? { names } : {}) }} still /></div>
        <span className="ws-card-open"><Icon size={14} weight="bold" /> {OPENING_NAME[spec.opening.kind]}</span>
      </div>
      <div className="ws-card-meta">
        <h3><Link href={to}>{spec.name}</Link></h3>
        <p>{spec.family} · {spec.shape}</p>
        <div className="ws-card-dots" role="group" aria-label={`${spec.name} colours`}>
          {spec.palettes.map((c) => <button key={c.id} type="button" aria-label={c.name} aria-pressed={c.id === pal} style={{ background: c.bg ?? c.accent, boxShadow: `inset 0 0 0 5px ${c.bg ?? "#fff"}, inset 0 0 0 20px ${c.accent}` }} onClick={() => setPal(c.id)} />)}
        </div>
      </div>
    </article>
  );
}
