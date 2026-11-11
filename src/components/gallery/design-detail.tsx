"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowCounterClockwise, X } from "@phosphor-icons/react";
import { Nav, SiteFooter } from "@/components/site/nav";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { FONT_PACKS, INTRO_PRESETS, paletteOf, specById, type DesignId } from "@/engine/registry";
import { OPENING_ICON } from "./design-card";
import { sampleData, sampleEvents } from "./samples";

export function DesignDetail({ id, palette }: { id: DesignId; palette?: string }) {
  const spec = specById(id);
  const [pal, setPal] = useState(paletteOf(spec, palette).id);
  const [type, setType] = useState("");
  const [intro, setIntro] = useState("");
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const Icon = OPENING_ICON[spec.opening.kind];
  const stationery = spec.layout === "stationery";
  const data = { ...sampleData(spec, pal), type, intro };
  const events = sampleEvents(spec);
  const start = `/start?design=${spec.id}&palette=${pal}${type ? `&type=${type}` : ""}${intro ? `&intro=${encodeURIComponent(intro)}` : ""}`;
  const phone = <Invitation key={`${spec.id}-${pal}-${type}`} data={data} events={events} greeting="Sara & family" open={open} onOpenChange={setOpen} />;

  return (
    <>
      <Nav />
      <main className="ws-page"><div className="ws-wrap">
        <Link href="/designs" className="ws-back"><ArrowLeft size={16} /> All designs</Link>
        <div className="ws-detail">
          <div className="ws-detail-stage" style={{ ["--stage" as string]: paletteOf(spec, pal).bg ?? spec.site.bg }}>
            <div className="ws-detail-phone"><Phone label={`${spec.name} live preview`}>{!full && phone}</Phone></div>
            <div className="ws-tools">
              <button type="button" aria-pressed={!open} onClick={() => setOpen(false)}>Cover</button>
              <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>Inside</button>
              <button type="button" onClick={() => setOpen(false)} disabled={!open}><ArrowCounterClockwise size={15} /> Replay opening</button>
              <button type="button" onClick={() => { setFull(true); dialog.current?.showModal(); }}>Full screen</button>
            </div>
          </div>

          <div className="ws-detail-info">
            <p className="ws-eyebrow">{spec.family} · {spec.shape}</p>
            <h1 className="ws-h1">{spec.name}</h1>
            <p className="ws-lead">{spec.blurb}</p>

            <div className="ws-opn"><Icon size={22} weight="duotone" /><div><strong>{spec.opening.label}</strong><span>{spec.opening.hint}</span></div></div>

            <section className="ws-sect"><h2>Colours</h2>
              <div className="ws-swatches">{spec.palettes.map((p) => (
                <button key={p.id} type="button" aria-pressed={pal === p.id} onClick={() => setPal(p.id)}>
                  <i style={{ background: p.accent, boxShadow: p.bg ? `inset 0 0 0 6px ${p.bg}` : undefined }} />{p.name}
                </button>
              ))}</div>
            </section>

            {stationery && (
              <>
                <section className="ws-sect"><h2>Lettering</h2>
                  <div className="ws-types">
                    <button type="button" aria-pressed={type === ""} onClick={() => setType("")}><span>Designer’s choice</span></button>
                    {FONT_PACKS.filter((f) => f.script || ["classic", "didone", "deco", "italiana", "garamond"].includes(f.id)).map((f) => (
                      <button key={f.id} type="button" aria-pressed={type === f.id} onClick={() => setType(f.id)} title={f.note}>
                        <span style={{ fontFamily: f.script ?? f.head, fontSize: f.script ? 24 : 18 }}>{spec.sample.names.split(" ")[0]}</span><small>{f.name}</small>
                      </button>
                    ))}
                  </div>
                </section>
                <section className="ws-sect"><h2>Opening line <small>optional</small></h2>
                  <select className="ws-select" value={intro} onChange={(e) => setIntro(e.target.value)} aria-label="Opening line">
                    <option value="">Designer’s choice</option>
                    {Array.from(new Set(INTRO_PRESETS.map((i) => i.group))).map((g) => (
                      <optgroup key={g} label={g}>{INTRO_PRESETS.filter((i) => i.group === g).map((i) => <option key={i.id} value={i.id === "none" ? "none" : i.text}>{i.label}</option>)}</optgroup>
                    ))}
                  </select>
                </section>
              </>
            )}

            <section className="ws-sect"><h2>Often chosen for</h2>
              <div className="ws-tags">{spec.cultures.map((c) => <Link key={c} href={`/designs?culture=${encodeURIComponent(c)}`}>{c}</Link>)}</div>
            </section>

            <div className="ws-cta-row">
              <Link href={start} className="ws-pill ws-pill--dark ws-pill--lg">Start with {spec.name} <ArrowRight size={18} /></Link>
              <Link href="/designs" className="ws-pill ws-pill--line ws-pill--lg">Compare designs</Link>
            </div>

          </div>
        </div>
      </div></main>
      <SiteFooter />
      <dialog className="ws-full" ref={dialog} onClose={() => setFull(false)} aria-label={`${spec.name} full screen preview`} style={{ ["--stage" as string]: paletteOf(spec, pal).bg ?? spec.site.bg }}>
        <button type="button" className="ws-x" onClick={() => dialog.current?.close()} aria-label="Close preview"><X size={22} /></button>
        {full && <div className="ws-full-in">{phone}</div>}
      </dialog>
    </>
  );
}
