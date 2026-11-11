"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { call } from "@/lib/api-client";
import "./site.css";

const navigation = [
  { href: "/designs", label: "Designs" },
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

/** Text-only mark until a logo exists. */
export function Wordmark({ light }: { light?: boolean }) {
  return <Link className={`ws-mark${light ? " ws-mark--light" : ""}`} href="/" aria-label="Wedsent home">wedsent</Link>;
}

/** A floating pill that stays with you. Dark over the hero and light sections alike. */
export function Nav({ studioHref = "/studio" }: { studioHref?: string }) {
  const [owner, setOwner] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    let active = true;
    void call<{ user: { id: string } | null }>("GET", "/api/me").then(({ user }) => { if (active) setOwner(Boolean(user)); }).catch(() => { if (active) setOwner(false); });
    return () => { active = false; };
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  return (
    <header className="ws-nav-wrap">
      <div className="ws-nav">
        <Wordmark light />
        <nav className="ws-nav-links" aria-label="Main">
          {navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={!href.includes("#") && pathname.startsWith(href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="ws-nav-end">
          <Link href={owner ? "/dashboard" : "/signin?mode=in"} className="ws-nav-in">{owner ? "My wedding" : "Sign in"}</Link>
          <Link href={owner ? studioHref : "/start"} className="ws-pill ws-pill--light">{owner ? "Open Studio" : "Create yours"}</Link>
          <button className="ws-burger" type="button" aria-label={menu ? "Close menu" : "Open menu"} aria-controls="ws-sheet" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={20} /> : <List size={20} />}</button>
        </div>
      </div>
      <nav className="ws-sheet" id="ws-sheet" aria-label="Mobile" hidden={!menu}>
        {navigation.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight size={18} /></Link>)}
        <Link href={owner ? "/dashboard" : "/signin?mode=in"} onClick={() => setMenu(false)}>{owner ? "My wedding" : "Sign in"}<ArrowUpRight size={18} /></Link>
        <Link className="ws-pill ws-pill--dark" href={owner ? studioHref : "/start"} onClick={() => setMenu(false)}>{owner ? "Open Studio" : "Create your invitation"}</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="ws-foot">
      <div className="ws-wrap ws-foot-in">
        <div><Wordmark /><p>Invitations that open, and replies that stay in one place.</p></div>
        <nav aria-label="Footer"><Link href="/designs">Designs</Link><Link href="/pricing">Pricing</Link><Link href="/start">Create an invitation</Link><Link href="/signin?mode=in">My wedding</Link><Link href="/credits">Artwork credits</Link></nav>
        <small>© {new Date().getFullYear()} Wedsent</small>
      </div>
    </footer>
  );
}
