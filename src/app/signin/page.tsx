"use client";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wordmark } from "@/components/site/nav";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { sampleData, sampleEvents } from "@/components/gallery/samples";
import { specById } from "@/engine/registry";
import { call, ApiError } from "@/lib/api-client";
import { safeAuthReturn } from "@/lib/auth-return";
import "@/components/site/site.css";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeAuthReturn(params.get("next"));
  const [mode, setMode] = useState<"up" | "in">(params.get("mode") === "in" ? "in" : "up");
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

  const spec = specById("gilt");
  return (
    <main className="ws-auth">
      <aside className="ws-auth-side" aria-hidden={false}>
        <Wordmark light />
        <div>
          <h2 className="ws-h2">Your invitation is waiting where you left it.</h2>
          <p>Save your draft, keep every household’s replies in one place, and pick up in Studio whenever you like.</p>
        </div>
        <div className="ws-auth-art" aria-hidden="true"><Phone><Invitation data={sampleData(spec)} still /></Phone></div>
      </aside>
      <div className="ws-auth-form">
        {checking ? <p role="status" className="ws-sub">Checking your account…</p> : (
          <form className="ws-form" onSubmit={submit}>
            <div className="ws-auth-mobile-top"><Wordmark /></div>
            <h1>{mode === "up" ? "Create your account" : "Welcome back"}</h1>
            <p className="ws-sub">{mode === "up" ? "Save your invitation and continue in Studio." : "Open your invitation and see your guest replies."}</p>
            <label className="ws-field"><span>Email</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label className="ws-field"><span>Password</span>
              <input type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === "up" ? 10 : undefined} />
              {mode === "up" && <small>At least 10 characters.</small>}
            </label>
            {err && <p className="ws-err" role="alert">{err}</p>}
            <button className="ws-pill ws-pill--dark ws-pill--lg" disabled={busy}>{busy ? "One moment…" : mode === "up" ? "Create my account" : "Sign in"} <ArrowRight size={18} /></button>
            <p className="ws-switch">{mode === "up" ? "Already have an account?" : "New here?"}{" "}<button type="button" onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(null); }}>{mode === "up" ? "Sign in" : "Create one"}</button></p>
            <Link className="ws-switch" href="/designs">Browse designs first</Link>
          </form>
        )}
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Form /></Suspense>; }
