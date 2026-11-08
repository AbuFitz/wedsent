"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, Link2, MessageCircle, QrCode, Share2, X } from "lucide-react";
import "./share-invitation.css";

type Props = { url: string; title: string; privateLink?: boolean; label?: string };

export function ShareInvitation({ url, title, privateLink = false, label = "Share invitation" }: Props) {
  const [open, setOpen] = useState(false);
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setBusy(true); setNotice("");
    const options = { errorCorrectionLevel: "H" as const, margin: 3, color: { dark: "#191D19", light: "#FFFFFFFF" } };
    Promise.all([
      QRCode.toDataURL(url, { ...options, width: 720 }),
      QRCode.toString(url, { ...options, type: "svg" as const, width: 720 }),
    ]).then(([nextPng, nextSvg]) => { if (alive) { setPng(nextPng); setSvg(nextSvg); } })
      .catch(() => { if (alive) setNotice("Couldn't generate the QR code. The link is still available below."); })
      .finally(() => { if (alive) setBusy(false); });
    return () => { alive = false; };
  }, [url, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setNotice("Link copied"); }
    catch { setNotice("Copy failed. Select the link below to copy it manually."); }
  };
  const nativeShare = async () => {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title, text: "You're invited", url }); }
    catch (e) { if (!(e instanceof DOMException && e.name === "AbortError")) setNotice("Sharing was unavailable. You can copy the link instead."); }
  };
  const download = (kind: "png" | "svg") => {
    const data = kind === "png" ? png : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    if (!data) return;
    const a = document.createElement("a");
    a.href = data; a.download = `wedsent-invitation-qr.${kind}`;
    document.body.appendChild(a); a.click(); a.remove();
  };
  return <>
    <button className="share-entry" type="button" onClick={() => setOpen(true)}><QrCode size={17}/>{label}</button>
    {open && <div className="share-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <section className="share-dialog" role="dialog" aria-modal="true" aria-label="Share invitation">
        <header><div><span>WEDSENT / SHARING</span><h2>{privateLink ? "A personal invitation" : "Share your celebration"}</h2></div><button type="button" aria-label="Close sharing" onClick={() => setOpen(false)}><X size={19}/></button></header>
        <p className="share-intro">{privateLink ? "This link is for one household. Anyone who receives it may be able to view and reply for that household." : "This public link shows the general invitation. It does not grant access to private guest details."}</p>
        <div className="share-card">
          <div className="share-qr">{png ? <img src={png} alt="QR code linking to this invitation" width="224" height="224"/> : <span>{busy ? "Creating QR code…" : "QR preview unavailable"}</span>}</div>
          <div className="share-card-caption"><strong>{title}</strong><small>Scan to open the invitation</small></div>
        </div>
        <label className="share-link"><span>Invitation link</span><input value={url} readOnly onFocus={(e) => e.target.select()} aria-label="Invitation link"/><button type="button" aria-label="Copy invitation link" onClick={() => void copy()}><Copy size={17}/></button></label>
        <div className="share-actions">
          <button type="button" onClick={() => void nativeShare()}><Share2 size={16}/> Share with phone</button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`You're invited: ${url}`)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/> WhatsApp</a>
        </div>
        <div className="share-download"><span>Download the QR code</span><button disabled={!png} type="button" onClick={() => download("png")}><Download size={15}/> PNG</button><button disabled={!svg} type="button" onClick={() => download("svg")}><Download size={15}/> SVG</button></div>
        {notice && <p className="share-feedback" role="status"><Check size={15}/>{notice}</p>}
        <footer><Link2 size={14}/>{privateLink ? "Treat this as a private link. Reset it from the guest list if shared accidentally." : "Public replies are unverified until you review them."}</footer>
      </section>
    </div>}
  </>;
}
