"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { call } from "@/lib/api-client";
import "./edition.css";

const navigation = [
  { href: "/designs", label: "Designs" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function Wordmark() {
  return <Link className="ed-wordmark" href="/" aria-label="Weddsent home">weddsent<span aria-hidden="true">.</span></Link>;
}

export function Nav({ studioHref = "/studio" }: { studioHref?: string }) {
  const [owner, setOwner] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    let active = true;
    void call<{ user: { id: string } | null }>("GET", "/api/me").then(({ user }) => {
      if (active) setOwner(Boolean(user));
    }).catch(() => { if (active) setOwner(false); });
    return () => { active = false; };
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  return (
    <header className="ed-header">
      <div className="ed-nav ed-width">
        <Wordmark />
        <nav className="ed-nav-links" aria-label="Main navigation">
          {navigation.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={href !== "/#how-it-works" && pathname.startsWith(href) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="ed-nav-actions">
          <Link href={owner ? "/dashboard" : "/signin?mode=in"} className="ed-signin">{owner ? "My wedding" : "Sign in"}</Link>
          <Link href={owner ? studioHref : "/start"} className="ed-button ed-button--primary">
            {owner ? "Open Studio" : "Create an invite"} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button className="ed-menu" type="button" aria-label={menu ? "Close menu" : "Open menu"} aria-controls="ed-mobile-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <nav className="ed-mobile-nav ed-width" aria-label="Mobile navigation" id="ed-mobile-navigation" hidden={!menu}>
        {navigation.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={16} /></Link>)}
        <Link href={owner ? "/dashboard" : "/signin?mode=in"} onClick={() => setMenu(false)}>{owner ? "My wedding" : "Sign in"}<ArrowUpRight size={16} /></Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="ed-footer">
      <div className="ed-width ed-footer-inner">
        <Wordmark />
        <nav aria-label="Footer">
          <Link href="/designs">Designs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/signin?mode=in">My wedding</Link>
          <Link href="/credits">Artwork credits</Link>
        </nav>
        <small>© {new Date().getFullYear()} Weddsent</small>
      </div>
    </footer>
  );
}
