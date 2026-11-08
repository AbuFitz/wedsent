"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLineUp, Sparkle, Eye } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { paletteOf, type DesignSpec, type OpeningKind } from "@/engine/registry";
import { sampleData, sampleEvents } from "./samples";
import "./gallery.css";

export const OPENING_ICON: Record<OpeningKind, typeof Sparkle> = { lift: ArrowLineUp, bloom: Sparkle, veil: Eye, focus: Eye, doors: Eye, curtain: Eye };
export const OPENING_NAME: Record<OpeningKind, string> = { lift: "Lifts away", bloom: "Opens outward", veil: "Soft reveal", focus: "Editorial focus", doors: "Double doors", curtain: "Curtain reveal" };

/** One design as a product shot: the cover and the inside, live, on the design's own backdrop. */
export function DesignCard({ spec, href, names }: { spec: DesignSpec; href?: string; names?: string }) {
  const [pal, setPal] = useState(spec.palettes[0].id);
  const Icon = OPENING_ICON[spec.opening.kind];
  const to = href ?? `/designs/${spec.id}?p=${pal}`;
  const bg = paletteOf(spec, pal).bg ?? spec.site.bg;
  return (
    <article className="dc">
      <div className="dc-stage" style={{ ["--stage" as string]: bg }}>
        <Link href={to} className="dc-hit" aria-label={`Preview ${spec.name}`} />
        <span className="dc-ph dc-ph--back"><Invitation data={{ ...sampleData(spec, pal), ...(names ? { names } : {}) }} still /></span>
        <span className="dc-ph dc-ph--front"><Invitation data={{ ...sampleData(spec, pal), ...(names ? { names } : {}) }} events={sampleEvents(spec)} open still /></span>
        <span className="dc-open"><Icon size={14} weight="bold" /> {spec.opening.label}</span>
      </div>
      <div className="dc-meta">
        <div>
          <h3><Link href={to}>{spec.name}</Link></h3>
          <p>{spec.family} · {spec.shape}</p>
        </div>
        <div className="dc-dots" role="group" aria-label={`${spec.name} colours`}>
          {spec.palettes.map((p) => (
            <button key={p.id} type="button" aria-pressed={pal === p.id} aria-label={p.name} title={p.name} onClick={() => setPal(p.id)} style={{ background: p.accent }} />
          ))}
        </div>
      </div>
    </article>
  );
}
