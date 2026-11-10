"use client";
import Link from "next/link";
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

  if (checking) return <main className="si"><Link href="/" className="si-logo">wedsent</Link><p className="si-note" role="status">Checking your account…</p></main>;

  return (
    <main className="si">
      <div className="si-top"><Link href="/" className="si-logo">wedsent</Link><Link href="/designs" className="si-explore">Explore invitations</Link></div>
      <div className="si-layout"><aside className="si-story" aria-label="Welcome to Wedsent"><span>AN INVITATION WORTH OPENING</span><h2>One lovely beginning. Everything in its place.</h2><p>Choose your design. Make it personal. Share with your people and keep their replies together.</p></aside>
      <form className="si-card" onSubmit={submit} noValidate>
        <span className="si-kicker">{mode === "up" ? "YOUR NEXT CHAPTER" : "GOOD TO HAVE YOU BACK"}</span>
        <h1>{mode === "up" ? "Keep your invitation." : "Welcome back."}</h1>
        <p className="si-sub">{mode === "up" ? "Create an account to save your design across devices, organise guests and publish when you're ready." : "Sign in to return to your invitation and guest replies."}</p>
        <label className="si-field"><span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="si-field"><span>Password</span>
          <input type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
          {mode === "up" && <small>At least 10 characters.</small>}
        </label>
        {err && <p className="si-err" role="alert">{err}</p>}
        <button className="btn btn-dark si-go" disabled={busy || !email || password.length < 10}>{busy ? "One moment…" : mode === "up" ? "Create my account" : "Sign in to my wedding"}</button>
        <p className="si-switch">
          {mode === "up" ? "Already have an account?" : "New here?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(null); }}>{mode === "up" ? "Sign in" : "Create one"}</button>
        </p>
      </form>
      </div>
      <p className="si-note">Early build: password sign-in only. Email sign-in links and password reset need an email provider, which isn’t connected yet.</p>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Form /></Suspense>; }
