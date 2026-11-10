"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { call } from "@/lib/api-client";
import "./nav.css";

export function Nav({ studioHref = "/studio" }: { studioHref?: string }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [session, setSession] = useState<"loading" | "guest" | "owner">("loading");
  useEffect(() => {
    let active = true;
    void call<{ user: { id: string } | null }>("GET", "/api/me").then((value) => {
      if (active) setSession(value.user ? "owner" : "guest");
    }).catch(() => { if (active) setSession("guest"); });
    return () => { active = false; };
  }, []);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });
  return (
    <motion.header className="nav" animate={{ y: hidden ? -90 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 36 }}>
      <nav className="nav-pill" aria-label="Main">
        <Link href="/" className="nav-logo">weddsent</Link>
        <Link href="/designs" className="nav-link">Designs</Link>
        <Link href="/pricing" className="nav-link">Pricing</Link>
        {session === "owner" ? <Link href="/dashboard" className="nav-account">My wedding</Link> : session === "guest" ? <Link href="/signin?mode=in" className="nav-account">Sign in</Link> : <span className="nav-account nav-account--loading" aria-hidden="true"/>}
        <Link href={session === "owner" ? studioHref : "/start"} className="nav-cta">{session === "owner" ? "Open Studio" : "Create invitation"}</Link>
      </nav>
    </motion.header>
  );
}
