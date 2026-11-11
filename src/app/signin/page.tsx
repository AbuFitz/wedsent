"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/site/nav";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { call, ApiError } from "@/lib/api-client";
import { safeAuthReturn } from "@/lib/auth-return";
import "./signin.css";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeAuthReturn(params.get("next"));
  const [mode, setMode] = useState<"up" | "in">((params.get("mode") === "in" ? "in" : "up"));
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void call<{ user: { id: string } | null }>("GET", "/api/me").then((result) => {
      if (active && result.user) router.replace(next);
      else if (active) setChecking(false);
    }).catch(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await call("POST", mode === "up" ? "/api/auth/signup" : "/api/auth/login", { email, password });
      router.replace(next);
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Something went wrong.");
      setBusy(false);
    }
  };

  if (checking) return <main className="si"><div className="ed-width si-top"><Wordmark /></div><p className="ed-width si-note" role="status">Checking your account…</p></main>;

  return (
    <main className="si">
      <div className="ed-width si-top"><Wordmark /><Link href="/designs" className="ed-text-link">Browse designs</Link></div>
      <div className="ed-width si-layout">
      <div className="si-photo"><Image src="/signin-masjid-wedding.webp" alt="Newlyweds beneath mosque arches" fill sizes="(max-width: 720px) 100vw, 50vw" priority /></div>
      <form className="si-card" onSubmit={submit}>
        <h1>{mode === "up" ? "Create your account" : "Sign in to Weddsent"}</h1>
        <p className="si-sub">{mode === "up" ? "Save your invitation and pick up where you left off in Studio." : "Open your invitation and see your guest replies."}</p>
        <label className="si-field"><span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="si-field"><span>Password</span>
          <input type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "up" ? 10 : undefined} />
          {mode === "up" && <small>At least 10 characters.</small>}
        </label>
        {err && <p className="si-err" role="alert">{err}</p>}
        <button className="ed-button ed-button--primary si-go" disabled={busy}>{busy ? "One moment…" : mode === "up" ? "Create my account" : "Sign in"} <ArrowRight size={17} /></button>
        <p className="si-switch">
          {mode === "up" ? "Already have an account?" : "New here?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(null); }}>{mode === "up" ? "Sign in" : "Create one"}</button>
        </p>
      </form>
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Form /></Suspense>; }
