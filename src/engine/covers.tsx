"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { InviteData } from "@/lib/designs";
import { paletteOf, type DesignSpec } from "./registry";
import { StationeryCard } from "./stationery";
import { splitNames } from "@/lib/designs";

type P = { data: InviteData; spec: DesignSpec; onOpen: () => void; still: boolean };
const ease = [0.22, 0.8, 0.2, 1] as const;

function Initials({ names }: { names: string }) {
  const n = splitNames(names);
  return <>{n.a.trim().charAt(0).toLocaleUpperCase() || "·"}<i>&amp;</i>{n.b.trim().charAt(0).toLocaleUpperCase() || "·"}</>;
}

/** Raised wax with initials rendered independently of the artwork. */
export function WaxSeal({ names, className = "" }: { names: string; className?: string }) {
  return <span className={`cv-wax ${className}`} aria-hidden="true"><span className="cv-wax-initials"><Initials names={names} /></span></span>;
}

/** An actual envelope object: raised wax lifts, flap folds, then the letter slides out. */
export function RosewoodCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, 1520);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  const start = () => { if (opening || still) return; if (reduced) onOpen(); else setOpening(true); };
  return <motion.section className="cover cv cv-rosewood" aria-label="Wax-sealed wedding envelope" exit={{ opacity: 0, transition: { duration: .13 } }}>
    <motion.div className="cv-rosewood-letter" aria-hidden="true" animate={opening ? { y: "-16%", scale: 1.025 } : { y: "8%", scale: .9 }} transition={{ duration: 1.06, delay: .32, ease: [.22,.78,.14,1] }}><StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill /></motion.div>
    <motion.div className="cv-rosewood-envelope" aria-hidden="true" animate={opening ? { y: "73%", rotateX: 9 } : { y: "0%", rotateX: 0 }} transition={{ duration: 1.06, delay: .35, ease: [.3,.65,.19,1] }}>
      <div className="cv-rosewood-back" />
      <div className="cv-rosewood-pocket" />
      <motion.div className="cv-rosewood-flap" animate={opening ? { rotateX: -160 } : { rotateX: 0 }} transition={{ duration: .78, delay: .17, ease: [.2,.68,.16,1] }} />
    </motion.div>
    <motion.div className="cv-rosewood-stamp" aria-hidden="true" animate={opening ? { opacity: 0, scale: .65, y: -22, rotate: -18 } : { opacity: 1, scale: 1, y: 0, rotate: -5 }} transition={{ duration: .45 }}><WaxSeal names={data.names} /></motion.div>
    <motion.span className="cv-rosewood-instruction" animate={{ opacity: opening ? 0 : 1 }}>TOGETHER WITH THEIR FAMILIES <small>TOUCH THE SEAL TO OPEN</small></motion.span>
    <button type="button" className="cv-hit" onClick={start} disabled={still || opening} aria-label="Break the wax seal and open the invitation" />
  </motion.section>;
}

/** Physically separate fabric panels with staggered curtain pull and a still card behind. */
export function VelvetStageCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => { if (!opening) return; const t = window.setTimeout(onOpen, 1800); return () => window.clearTimeout(t); }, [opening, onOpen]);
  const start = () => { if (opening || still) return; if (reduced) onOpen(); else setOpening(true); };
  return <motion.section className="cover cv cv-velvet" aria-label="Velvet curtain invitation" exit={{ opacity: 0, transition: { duration: .16 } }}>
    <motion.div className="cv-velvet-card" aria-hidden="true" animate={{ scale: opening ? 1.035 : .91, filter: opening ? "brightness(1)" : "brightness(.52)" }} transition={{ duration: 1.62, ease }}><StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill /></motion.div>
    <motion.div className="cv-velvet-spotlight" aria-hidden="true" animate={{ opacity: opening ? 1 : .2, scale: opening ? 1 : .88 }} transition={{ duration: 1.45, ease }} />
    <div className="cv-velvet-top" aria-hidden="true" />
    <div className="cv-velvet-pair" aria-hidden="true">
      <motion.div className="cv-velvet-drape cv-velvet-left" animate={opening ? { x: "-79%", scaleX: .44, skewY: -2.2, rotateY: -12 } : { x: 0, scaleX: 1, skewY: 0, rotateY: 0 }} transition={{ duration: 1.58, delay: .08, ease: [.46,.04,.13,1] }}><span className="cv-velvet-pleats" /></motion.div>
      <motion.div className="cv-velvet-drape cv-velvet-right" animate={opening ? { x: "79%", scaleX: .44, skewY: 2.2, rotateY: 12 } : { x: 0, scaleX: 1, skewY: 0, rotateY: 0 }} transition={{ duration: 1.67, delay: .14, ease: [.46,.04,.13,1] }}><span className="cv-velvet-pleats" /></motion.div>
    </div>
    <motion.div className="cv-velvet-cord" aria-hidden="true" animate={opening ? { opacity: 0, scale: .86, y: 14 } : { opacity: 1, scale: 1, y: 0 }} transition={{ duration: .34 }}><span /></motion.div>
    <motion.div className="cv-velvet-tieback cv-velvet-tieback--left" aria-hidden="true" animate={opening ? { x: "-12%", opacity: 1 } : { x: "-45%", opacity: 0 }} transition={{ duration: .8, delay: .36 }} />
    <motion.div className="cv-velvet-tieback cv-velvet-tieback--right" aria-hidden="true" animate={opening ? { x: "12%", opacity: 1 } : { x: "45%", opacity: 0 }} transition={{ duration: .8, delay: .42 }} />
    <motion.span className="cv-velvet-instruction" animate={{ opacity: opening ? 0 : 1 }}>PULL BACK THE CURTAIN</motion.span>
    <button type="button" className="cv-hit" onClick={start} disabled={still || opening} aria-label="Draw the curtains and reveal the invitation" />
  </motion.section>;
}

/** Illustrated collections arrive as a separate letter jacket, not a duplicate of the invitation card. */
export function EngravedLetterCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const t = window.setTimeout(onOpen, 920);
    return () => window.clearTimeout(t);
  }, [opening, onOpen]);
  const start = () => { if (opening || still) return; if (reduced) onOpen(); else setOpening(true); };
  const names = splitNames(data.names);
  return <motion.section className={`cover cv cv-engraved cv-engraved--${spec.id}`} aria-label="Open the illustrated letter" exit={{ opacity: 0, transition: { duration: .13 } }}>
    <motion.div className="cv-engraved-jacket" animate={opening ? { y: "-96%", rotateX: -10, opacity: .45 } : { y: "0%", rotateX: 0, opacity: 1 }} transition={{ duration: .88, ease: [.3,.78,.12,1] }}>
      <span className="cv-engraved-ornament" aria-hidden="true">✦</span>
      <span className="cv-engraved-kicker">AN INVITATION</span>
      <h2>{names.a}<i>&amp;</i>{names.b || "Your celebration"}</h2>
      <span className="cv-engraved-rule" aria-hidden="true" />
      <span className="cv-engraved-action">LIFT TO DISCOVER</span>
    </motion.div>
    <button type="button" className="cv-hit" onClick={start} disabled={still || opening} aria-label="Lift the letter jacket and open the invitation" />
  </motion.section>;
}

/** Material-led, phased openings. The card is real HTML; only its physical sleeve is animated. */
export function KeepsakeCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const lift = spec.id === "embossed";
  const dark = spec.id === "gilt";
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, lift ? 1320 : 1480);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen, lift]);
  const start = () => {
    if (still || opening) return;
    if (reduced) onOpen();
    else setOpening(true);
  };
  return (
    <motion.section className={`cover cv cv-keepsake cv-keepsake--${spec.id}`} aria-label={`${spec.name} invitation envelope`} exit={{ opacity: 0, transition: { duration: 0.16 } }}>
      <motion.div className="cv-keepsake-card" aria-hidden="true" animate={opening ? { scale: 1.035, y: lift ? 18 : -8, filter: "brightness(1.06)" } : { scale: .955, y: 8, filter: "brightness(.9)" }} transition={{ duration: 1.2, ease }}>
        <StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill />
      </motion.div>
      <div className="cv-pearl-panels" aria-hidden="true">
        {lift ? <motion.div className="cv-keepsake-sleeve" animate={opening ? { y: "-110%", rotateX: -11, opacity: .86 } : { y: "0%", rotateX: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [.25,.74,.13,1] }} /> : <>
          <motion.div className="cv-pearl-panel cv-pearl-panel--left" animate={opening ? { rotateY: -117, x: "-9%", filter: "brightness(.68)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.28, delay: .13, ease: [0.2, .74, .1, 1] }} />
          <motion.div className="cv-pearl-panel cv-pearl-panel--right" animate={opening ? { rotateY: 117, x: "9%", filter: "brightness(.68)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.28, delay: .13, ease: [0.2, .74, .1, 1] }} />
        </>}
      </div>
      <motion.div className="cv-pearl-seal" aria-hidden="true" animate={opening ? { opacity: 0, scale: .84, y: lift ? -70 : -15, rotate: dark ? -12 : 12 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }} transition={{ duration: .44, ease: [.2,.7,.2,1] }}>
        <span className="cv-pearl-seal-inner"><Initials names={data.names} /></span>
      </motion.div>
      <motion.span className="cv-pearl-caption" animate={opening ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }} transition={{ duration: .28 }}>{lift ? "LIFT TO REVEAL" : "TAP THE SEAL TO OPEN"}</motion.span>
      <button type="button" className="cv-hit" onClick={start} disabled={still || opening} aria-label={`Open ${spec.name} invitation`} />
    </motion.section>
  );
}

function Face({ data, spec, hint }: { data: InviteData; spec: DesignSpec; hint: string }) {
  return (
    <>
      <StationeryCard data={data} spec={spec} palette={paletteOf(spec, data.palette)} fill />
      <span className="cv-hint" aria-hidden="true"><i />{hint}</span>
    </>
  );
}

/** The cover softly clears. The quietest opening: no object metaphor, just focus. */
export function VeilCover({ data, spec, onOpen }: P) {
  const reduced = useReducedMotion();
  return (
    <motion.section className="cover cv" aria-label="Invitation cover" exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.035, filter: "blur(14px)", transition: { duration: 0.95, ease } }}>
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={onOpen} aria-label="Open invitation" />
    </motion.section>
  );
}

/** Editorial focus: a restrained typographic reveal with a distinct depth and timing. */
export function FocusCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className="cover cv"
      aria-label="Invitation cover"
      exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : {
        opacity: 0, scale: 0.96, y: -20, filter: "blur(5px)",
        transition: { duration: 0.7, ease },
      }}
    >
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={onOpen} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

/** Hinged architectural panels with a single perspective vanishing plane. */
export function DoorsCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, 1050);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  return (
    <motion.section className="cover cv cv-doors" aria-label="Invitation cover" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
      <Face data={data} spec={spec} hint="" />
      <div className="cv-pair" aria-hidden="true">
        <motion.div className="cv-door cv-door--left" animate={opening ? { rotateY: -118, x: "-3%", filter: "brightness(.58)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.05, ease: [0.28, 0.76, 0.14, 1] }} />
        <motion.div className="cv-door cv-door--right" animate={opening ? { rotateY: 118, x: "3%", filter: "brightness(.58)" } : { rotateY: 0, x: 0, filter: "brightness(1)" }} transition={{ duration: 1.07, delay: .06, ease: [0.28, 0.76, 0.14, 1] }} />
      </div>
      {!opening && <span className="cv-invite-action" aria-hidden="true">Tap to enter</span>}
      <button type="button" className="cv-hit" onClick={() => reduced ? onOpen() : setOpening(true)} disabled={still || opening} aria-label="Open the invitation doors" />
    </motion.section>
  );
}

/** Fabric-like surface with directional light on each fold; no WebGL required. */
export function CurtainCover({ data, spec, onOpen, still }: P) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(onOpen, 1150);
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  return (
    <motion.section className="cover cv cv-curtain" aria-label="Invitation cover" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
      <Face data={data} spec={spec} hint="" />
      <div className="cv-pair" aria-hidden="true">
        <motion.div className="cv-drape cv-drape--left" animate={opening ? { x: "-104%", scaleX: 0.8 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.05, ease: [0.3, 0, 0.16, 1] }} />
        <motion.div className="cv-drape cv-drape--right" animate={opening ? { x: "104%", scaleX: 0.8 } : { x: 0, scaleX: 1 }} transition={{ duration: 1.05, ease: [0.3, 0, 0.16, 1] }} />
      </div>
      {!opening && <span className="cv-invite-action" aria-hidden="true">Reveal the invitation</span>}
      <button type="button" className="cv-hit" onClick={() => reduced ? onOpen() : setOpening(true)} disabled={still || opening} aria-label="Draw the invitation curtains" />
    </motion.section>
  );
}

/** The invitation opens outward from where you touch. */
export function BloomCover({ data, spec, onOpen, still }: P) {
  const r = useMotionValue(0);
  const [o, setO] = useState({ x: 50, y: 62 });
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const mask = useTransform(r, (v) => `radial-gradient(circle at ${o.x}% ${o.y}%, transparent ${v}%, #000 ${v + 0.4}%)`);
  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (go) return;
    if (reduced) return onOpen();
    const b = e.currentTarget.getBoundingClientRect();
    // keyboard clicks have no pointer position: open from the centre
    setO(e.detail === 0 ? { x: 50, y: 62 } : { x: ((e.clientX - b.left) / b.width) * 100, y: ((e.clientY - b.top) / b.height) * 100 });
    setGo(true);
    requestAnimationFrame(() => animate(r, 150, { duration: 1.15, ease: [0.5, 0, 0.2, 1] }).then(onOpen));
  };
  return (
    <motion.section className="cover cv" aria-label="Invitation cover" style={{ WebkitMaskImage: go ? mask : undefined, maskImage: go ? mask : undefined }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={open} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}

/** The cover is a sheet you lift away. Drag, tap or press Enter. */
export function LiftCover({ data, spec, onOpen, still }: P) {
  const ref = useRef<HTMLElement>(null);
  const y = useMotionValue(0);
  const shadow = useTransform(y, (v) => (v < -4 ? "0 3cqw 10cqw rgba(0,0,0,.35)" : "0 0 0 rgba(0,0,0,0)"));
  const reduced = useReducedMotion();
  const finish = () => {
    if (reduced) return onOpen();
    const h = ref.current?.clientHeight ?? 800;
    animate(y, -h * 1.03, { type: "spring", stiffness: 150, damping: 24, restSpeed: 4 }).then(onOpen);
  };
  return (
    <motion.section
      ref={ref} className="cover cv" aria-label="Invitation cover" style={{ y, boxShadow: shadow, touchAction: "none" }}
      drag={still ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.9, bottom: 0.05 }}
      onDragEnd={(_, info) => {
        const h = ref.current?.clientHeight ?? 800;
        if (info.offset.y < -h * 0.2 || info.velocity.y < -500) finish();
        else animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      exit={{ y: "-104%", transition: { duration: 0.01 } }}
    >
      <Face data={data} spec={spec} hint={spec.opening.label} />
      <button type="button" className="cv-hit" onClick={finish} disabled={still} aria-label="Open invitation" />
    </motion.section>
  );
}
