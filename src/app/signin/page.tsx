"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { call, ApiError } from "@/lib/api-client";
import "./signin.css";

function Form() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/dashboard";
  const [mode, setMode] = useState<"up" | "in">("up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await call("POST", mode === "up" ? "/api/auth/signup" : "/api/auth/login", { email, password });
      router.push(next);
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <main className="si">
      <Link href="/" className="si-logo">wedsent</Link>
      <form className="si-card" onSubmit={submit} noValidate>
        <h1>{mode === "up" ? "Save your invitation" : "Welcome back"}</h1>
        <p className="si-sub">{mode === "up" ? "Create an account to keep your invitation, add guests and publish a link." : "Sign in to pick up where you left off."}</p>
        <label className="si-field"><span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="si-field"><span>Password</span>
          <input type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
          {mode === "up" && <small>At least 10 characters.</small>}
        </label>
        {err && <p className="si-err" role="alert">{err}</p>}
        <button className="btn btn-dark si-go" disabled={busy || !email || !password}>{busy ? "One moment…" : mode === "up" ? "Create account" : "Sign in"}</button>
        <p className="si-switch">
          {mode === "up" ? "Already have an account?" : "New here?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(null); }}>{mode === "up" ? "Sign in" : "Create one"}</button>
        </p>
      </form>
      <p className="si-note">Early build: password sign-in only. Email sign-in links and password reset need an email provider, which isn’t connected yet.</p>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Form /></Suspense>; }
