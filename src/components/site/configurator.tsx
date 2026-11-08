"use client";
import { useMemo, useRef, useState } from "react";
import { UploadSimple } from "@phosphor-icons/react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { defaults, type InviteData } from "@/lib/designs";
import { storePhoto } from "@/lib/photo-upload";
import { DESIGNS, FONT_PACKS, INTRO_PRESETS, paletteOf, specById, type DesignId } from "@/engine/registry";
import "./configurator.css";

const LETTERING = FONT_PACKS.filter((f) => ["classic", "pinyon", "vibes", "didone", "deco", "garamond", "editorial2"].includes(f.id));

/** The real invitation, with the real controls. Nothing here is a mock: change a control and the phone changes. */
export function Configurator({ initial = "gallery", compact = false, onChange }: { initial?: DesignId; compact?: boolean; onChange?: (d: InviteData) => void }) {
  const first = specById(initial);
  const [d, setD] = useState<InviteData>({ ...defaults, design: first.id, names: first.sample.names, occasion: first.sample.occasion, message: "We would be honoured to celebrate with you.", venue: "The Glasshouse", address: "1 High Street", city: "London" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const spec = specById(d.design);
  const pal = paletteOf(spec, d.palette);
  const set = (p: Partial<InviteData>) => setD((x) => { const n = { ...x, ...p }; onChange?.(n); return n; });
  const intro = useMemo(() => INTRO_PRESETS.find((i) => i.text === d.intro)?.id ?? (d.intro === "none" ? "none" : d.intro ? "custom" : ""), [d.intro]);

  const take = async (f?: File) => {
    if (!f) return;
    setBusy(true); setErr(null);
    try { set({ photo: await storePhoto(f, false) }); } catch (e) { setErr(e instanceof Error ? e.message : "Couldn’t add that photo."); }
    setBusy(false);
  };
  const pickDesign = (id: DesignId) => { const s = specById(id); set({ design: id, palette: "", type: "", intro: "", names: d.names === specById(d.design).sample.names ? s.sample.names : d.names, occasion: d.occasion === specById(d.design).sample.occasion ? s.sample.occasion : d.occasion }); setOpen(false); };

  return (
    <div className={`cf${compact ? " cf--compact" : ""}`}>
      <div className="cf-controls">
        <fieldset className="cf-group">
          <legend>Design</legend>
          <div className="cf-designs" role="group" aria-label="Design">
            {DESIGNS.map((x) => <button key={x.id} type="button" aria-pressed={d.design === x.id} onClick={() => pickDesign(x.id)}>{x.name}</button>)}
          </div>
        </fieldset>
        <label className="cf-field"><span>Names</span><input value={d.names} maxLength={60} onChange={(e) => set({ names: e.target.value })} autoComplete="off" /></label>
        <div className="cf-group">
          <span className="cf-label">Photograph</span>
          <div className="cf-photo">
            {d.photo ? <img src={d.photo.src} alt="Your photograph" /> : <span className="cf-ph" aria-hidden="true"><UploadSimple size={20} /></span>}
            <div>
              <button type="button" className="btn btn-light" onClick={() => file.current?.click()} disabled={busy}>{busy ? "Adding…" : d.photo ? "Replace photo" : "Upload a photo"}</button>
              {d.photo && <button type="button" className="cf-link" onClick={() => set({ photo: null })}>Remove</button>}
              <p>Used on Gallery and Arch, and inside every design. Stays on your device.</p>
            </div>
            <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          {err && <small className="cf-err" role="alert">{err}</small>}
        </div>
        <fieldset className="cf-group">
          <legend>Colour</legend>
          <div className="cf-pals">{spec.palettes.map((p) => <button key={p.id} type="button" aria-pressed={pal.id === p.id} aria-label={p.name} title={p.name} onClick={() => set({ palette: p.id, accent: "" })}><i style={{ background: p.accent, boxShadow: p.bg ? `inset 0 0 0 5px ${p.bg}` : undefined }} /></button>)}</div>
        </fieldset>
        <fieldset className="cf-group">
          <legend>Lettering</legend>
          <div className="cf-type">
            <button type="button" aria-pressed={d.type === ""} onClick={() => set({ type: "" })}><span>Designer’s choice</span></button>
            {LETTERING.map((f) => <button key={f.id} type="button" aria-pressed={d.type === f.id} onClick={() => set({ type: f.id })} title={f.name}><span style={{ fontFamily: f.script ?? f.head, fontSize: f.script ? 22 : 17 }}>{d.names.split(/[ &]/)[0] || "Amina"}</span></button>)}
          </div>
        </fieldset>
        <label className="cf-field"><span>Opening line <i>optional</i></span>
          <select value={intro} onChange={(e) => { const v = e.target.value; const p = INTRO_PRESETS.find((i) => i.id === v); set({ intro: v === "" ? "" : v === "none" ? "none" : p?.text ?? "" }); }}>
            <option value="">Designer’s choice</option>
            {Array.from(new Set(INTRO_PRESETS.map((i) => i.group))).map((g) => <optgroup key={g} label={g}>{INTRO_PRESETS.filter((i) => i.group === g).map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}</optgroup>)}
          </select>
        </label>
        <div className="cf-row">
          <label className="cf-field"><span>Venue</span><input value={d.venue} maxLength={80} onChange={(e) => set({ venue: e.target.value })} /></label>
          <label className="cf-field"><span>Address</span><input value={d.address} maxLength={160} onChange={(e) => set({ address: e.target.value })} /></label>
        </div>
      </div>
      <div className="cf-stage">
        <div className="cf-phone"><Phone label="Live preview"><Invitation key={`${d.design}-${d.palette}-${d.type}`} data={d} open={open} onOpenChange={setOpen} events={[{ id: "c1", title: d.occasion || "Ceremony", startsOn: d.date, startsAt: d.time, venue: d.venue, address: d.address, city: d.city }]} /></Phone></div>
        <div className="cf-bar">
          <button type="button" aria-pressed={!open} onClick={() => setOpen(false)}>Cover</button>
          <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>Inside</button>
        </div>
      </div>
    </div>
  );
}
