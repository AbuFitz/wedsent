"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from "motion/react";
import { Sparkle } from "@phosphor-icons/react";
import { fit, splitNames, type InviteData } from "@/lib/designs";
import { resolveIntro } from "./stationery";
import type { DesignSpec } from "./registry";

type P = { data: InviteData; spec: DesignSpec; onOpen: () => void; still: boolean };

function useOpen(onOpen: () => void, ms: number) {
  const reduced = useReducedMotion();
  const [go, setGo] = useState(false);
  const t = useRef<number | null>(null);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return { go, trigger: () => { if (go) return; if (reduced) return onOpen(); setGo(true); t.current = window.setTimeout(onOpen, ms); } };
}
const Names = ({ data, cls, w = 74, per = 0.46, max = 15 }: { data: InviteData; cls: string; w?: number; per?: number; max?: number }) => {
  const n = splitNames(data.names);
  const label = n.joined ? `${n.a} & ${n.b}` : n.a;
  return <span className={cls} style={{ fontSize: `${fit(label, w, per, max, 7)}cqw` }}>{label}</span>;
};

/* Two arched doors that part. */
export function GatesCover({ data, spec, onOpen }: P) {
  const { go, trigger } = useOpen(onOpen, 1250);
  return (
    <motion.section className="cover gates-cover" aria-label="Invitation cover" data-go={go} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      {(["l", "r"] as const).map((side) => (
        <motion.div key={side} className={`gate gate-${side}`} animate={{ x: go ? (side === "l" ? "-102%" : "102%") : 0 }} transition={{ duration: 1.15, ease: [0.65, 0, 0.2, 1] }}>
          <svg viewBox="0 0 390 830" preserveAspectRatio="none" aria-hidden="true">
            <path d="M38 830V310A157 157 0 0 1 352 310V830" fill="none" stroke="url(#foil-g)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            <path d="M54 830V312A141 141 0 0 1 336 312V830" fill="none" stroke="url(#foil-g)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
          </svg>
          <i className="gate-knob" />
        </motion.div>
      ))}
      <svg width="0" height="0" aria-hidden="true"><defs><linearGradient id="foil-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8F6B2A" /><stop offset=".35" stopColor="#F0DA98" /><stop offset=".6" stopColor="#B88B3A" /><stop offset=".85" stopColor="#F7E9B8" /><stop offset="1" stopColor="#9A7330" /></linearGradient></defs></svg>
      <motion.button type="button" className="gates-btn" onClick={trigger} animate={{ opacity: go ? 0 : 1 }} transition={{ duration: 0.3 }} aria-label={`Open invitation. ${spec.opening.label}`}>
        <span className="gates-kicker">You are invited</span>
        <Names data={data} cls="gates-names" />
        <span className="gates-hint">{spec.opening.label}</span>
      </motion.button>
    </motion.section>
  );
}

/* A lattice that blooms open from a central star. */
export function IrisCover({ data, spec, onOpen }: P) {
  const r = useMotionValue(0);
  const mask = useTransform(r, (v) => `radial-gradient(circle at 50% 52%, transparent ${v}%, #000 ${v + 0.6}%)`);
  const [go, setGo] = useState(false);
  const reduced = useReducedMotion();
  const open = () => {
    if (go) return;
    if (reduced) return onOpen();
    setGo(true);
    animate(r, 140, { duration: 1.5, ease: [0.55, 0, 0.25, 1] }).then(onOpen);
  };
  return (
    <motion.section className="cover iris-cover" aria-label="Invitation cover" style={{ WebkitMaskImage: mask, maskImage: mask }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
      <span className="iris-tiles" aria-hidden="true" />
      <span className="iris-vignette" aria-hidden="true" />
      <motion.button type="button" className="iris-btn" onClick={open} animate={{ scale: go ? 1.25 : 1, opacity: go ? 0 : 1 }} transition={{ duration: 0.5 }} aria-label={`Open invitation. ${spec.opening.label}`}>
        <span className="iris-ring"><Sparkle weight="fill" size="38%" aria-hidden="true" /></span>
        <Names data={data} cls="iris-names" w={56} max={11} />
        <span className="iris-hint">{spec.opening.label}</span>
      </motion.button>
    </motion.section>
  );
}

/* Heavy drapes that draw apart. */
export function CurtainCover({ data, spec, onOpen }: P) {
  const { go, trigger } = useOpen(onOpen, 1300);
  return (
    <motion.section className="cover curtain-cover" aria-label="Invitation cover" data-go={go} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      <motion.div className="drape drape-l" animate={{ x: go ? "-100%" : 0, scaleX: go ? 0.7 : 1 }} style={{ transformOrigin: "0 50%" }} transition={{ duration: 1.25, ease: [0.55, 0, 0.2, 1] }} />
      <motion.div className="drape drape-r" animate={{ x: go ? "100%" : 0, scaleX: go ? 0.7 : 1 }} style={{ transformOrigin: "100% 50%" }} transition={{ duration: 1.25, ease: [0.55, 0, 0.2, 1] }} />
      <span className="valance" aria-hidden="true" />
      <motion.button type="button" className="curtain-btn" onClick={trigger} animate={{ opacity: go ? 0 : 1 }} transition={{ duration: 0.3 }} aria-label={`Open invitation. ${spec.opening.label}`}>
        <span className="curtain-kicker">{resolveIntro(data, spec) || "You are invited"}</span>
        <Names data={data} cls="curtain-names" w={64} max={13} />
        <span className="curtain-hint">{spec.opening.label}</span>
      </motion.button>
    </motion.section>
  );
}
