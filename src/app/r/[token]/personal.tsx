"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Invitation } from "@/components/invitation/invitation";
import { Phone } from "@/components/phone";
import { call, ApiError } from "@/lib/api-client";
import "@/components/guest/guest.css";

export function PersonalInvite({ token }: { token: string }) {
  const [view, setView] = useState<any>(null);
  const [err, setErr] = useState<ApiError | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    call("GET", `/api/r/${token}`).then(setView, (e) => setErr(e));
  }, [token]);
  useEffect(() => { if (view && sessionStorage.getItem(`opened:${token.slice(0, 10)}`)) setOpen(true); }, [view, token]);

  if (err) return (
    <main className="guest guest--msg"><div className="guest-msg">
      <h1>{err.status === 404 ? "This link isn’t active" : "Couldn’t open your invitation"}</h1>
      <p>{err.status === 404 ? "It may have been replaced or turned off. Ask the couple for a fresh link." : err.message}</p>
      {err.status !== 404 && <button className="btn btn-light" onClick={() => location.reload()}>Try again</button>}
    </div></main>
  );
  if (!view) return <main className="guest" />;
  return (
    <main className="guest" style={{ ["--g-bg" as string]: "#101014" }}>
      <div className="guest-wrap">
        <Phone label="Invitation">
          <Invitation data={view.content} syncChrome open={open} onOpenChange={(v) => { setOpen(v); if (v) sessionStorage.setItem(`opened:${token.slice(0, 10)}`, "1"); }} rsvpHref={`/r/${token}/reply`} events={view.events} greeting={view.household.name} />
        </Phone>
        <p className="guest-note">Invitation for {view.household.name}</p>
      </div>
    </main>
  );
}
