"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowCounterClockwise, X } from "@phosphor-icons/react";
import { Nav } from "@/components/site/nav";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { FONT_PACKS, INTRO_PRESETS, paletteOf, specById, type DesignId } from "@/engine/registry";
import { OPENING_ICON } from "./design-card";
import { sampleData, sampleEvents } from "./samples";
import "./detail.css";

export function DesignDetail({ id, palette }: { id: DesignId; palette?: string }) {
  const spec = specById(id);
  const [pal, setPal] = useState(paletteOf(spec, palette).id);
  const [type, setType] = useState("");
  const [intro, setIntro] = useState("");
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const Icon = OPENING_ICON[spec.opening.kind];
  const stationery = spec.layout === "stationery";
  const data = { ...sampleData(spec, pal), type, intro };
  const events = sampleEvents(spec);
  const start = `/start?design=${spec.id}&palette=${pal}${type ? `&type=${type}` : ""}${intro ? `&intro=${encodeURIComponent(intro)}` : ""}`;
  const phone = <Invitation key={`${spec.id}-${pal}-${type}`} data={data} events={events} greeting="Sara & family" open={open} onOpenChange={setOpen} />;

  return (
    <>
      <Nav />
      <main className="dd">
        <Link href="/designs" className="dd-back"><ArrowLeft size={16} /> All designs</Link>
        <div className="dd-grid">
          <div className="dd-stage" style={{ ["--stage" as string]: paletteOf(spec, pal).bg ?? spec.site.bg }}>
            <div className="dd-phone"><Phone label={`${spec.name} live preview`}>{phone}</Phone></div>
            <div className="dd-tools">
              <div className="dd-seg" role="group" aria-label="Preview">
                <button type="button" aria-pressed={!open} onClick={() => setOpen(false)}>Cover</button>
                <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>Inside</button>
              </div>
              <button type="button" className="dd-ghost" onClick={() => setOpen(false)} disabled={!open}><ArrowCounterClockwise size={15} /> Replay opening</button>
              <button type="button" className="dd-ghost" onClick={() => setFull(true)}>Full screen</button>
            </div>
          </div>

          <div className="dd-info">
            <p className="dd-kicker">{spec.family} · {spec.shape}</p>
            <h1>{spec.name}</h1>
            <p className="dd-blurb">{spec.blurb}</p>

            <div className="dd-open"><Icon size={22} weight="duotone" /><div><strong>{spec.opening.label}</strong><span>{spec.opening.hint}</span></div></div>

            <section><h2>Colours</h2>
              <div className="dd-pals">{spec.palettes.map((p) => (
                <button key={p.id} type="button" aria-pressed={pal === p.id} onClick={() => setPal(p.id)}>
                  <i style={{ background: p.accent, boxShadow: p.bg ? `inset 0 0 0 6px ${p.bg}` : undefined }} />{p.name}
                </button>
              ))}</div>
            </section>

            {stationery && (
              <>
                <section><h2>Lettering</h2>
                  <div className="dd-types">
                    <button type="button" aria-pressed={type === ""} onClick={() => setType("")}><span>Designer’s choice</span></button>
                    {FONT_PACKS.filter((f) => f.script || ["classic", "didone", "deco", "italiana", "garamond"].includes(f.id)).map((f) => (
                      <button key={f.id} type="button" aria-pressed={type === f.id} onClick={() => setType(f.id)} title={f.note}>
                        <span style={{ fontFamily: f.script ?? f.head, fontSize: f.script ? 24 : 18 }}>{spec.sample.names.split(" ")[0]}</span><small>{f.name}</small>
                      </button>
                    ))}
                  </div>
                </section>
                <section><h2>Opening line <small>optional</small></h2>
                  <select className="dd-select" value={intro} onChange={(e) => setIntro(e.target.value)} aria-label="Opening line">
                    <option value="">Designer’s choice</option>
                    {Array.from(new Set(INTRO_PRESETS.map((i) => i.group))).map((g) => (
                      <optgroup key={g} label={g}>{INTRO_PRESETS.filter((i) => i.group === g).map((i) => <option key={i.id} value={i.id === "none" ? "none" : i.text}>{i.label}</option>)}</optgroup>
                    ))}
                  </select>
                </section>
              </>
            )}

            <section><h2>Often chosen for</h2>
              <div className="dd-tags">{spec.cultures.map((c) => <Link key={c} href={`/designs?culture=${encodeURIComponent(c)}`}>{c}</Link>)}</div>
            </section>

            <div className="dd-cta">
              <Link href={start} className="btn btn-dark">Start with {spec.name} <ArrowRight size={18} /></Link>
              <Link href="/designs" className="btn btn-light">Compare designs</Link>
            </div>
            <p className="dd-fine">Sample names and events. Your own details replace them in the Studio.</p>
          </div>
        </div>
      </main>

      {full && (
        <div className="dd-full" role="dialog" aria-modal="true" aria-label={`${spec.name} full screen preview`} style={{ ["--stage" as string]: paletteOf(spec, pal).bg ?? spec.site.bg }}>
          <button type="button" className="dd-x" onClick={() => setFull(false)} aria-label="Close preview"><X size={22} /></button>
          <div className="dd-full-in">{phone}</div>
        </div>
      )}
    </>
  );
}
