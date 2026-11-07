"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import "./nav.css";

export function Nav({ studioHref = "/studio" }: { studioHref?: string }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });
  return (
    <motion.header className="nav" animate={{ y: hidden ? -90 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 36 }}>
      <nav className="nav-pill" aria-label="Main">
        <Link href="/" className="nav-logo">wedsent</Link>
        <a href="#designs" className="nav-link">Designs</a>
        <a href="#status" className="nav-link">What works</a>
        <Link href={studioHref} className="nav-cta">Open Studio</Link>
      </nav>
    </motion.header>
  );
}
