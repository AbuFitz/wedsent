import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/gloock/400.css";
import "@fontsource/young-serif/400.css";
import "@fontsource-variable/hedvig-letters-serif/index.css";
import "@fontsource-variable/literata/opsz.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource/libre-caslon-text/400.css";
import "@fontsource-variable/inter-tight/index.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "@fontsource-variable/onest/index.css";
import "@fontsource-variable/host-grotesk/index.css";
import "@fontsource-variable/schibsted-grotesk/index.css";
import "@fontsource-variable/figtree/index.css";
import "@fontsource-variable/funnel-display/index.css";
import "@fontsource-variable/albert-sans/index.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/geist/index.css";

const serifs = [["Fraunces", '"Fraunces Variable"', 400], ["Gloock", '"Gloock"', 400], ["Young Serif", '"Young Serif"', 400], ["Hedvig Letters Serif", '"Hedvig Letters Serif Variable"', 400], ["Literata", '"Literata Variable"', 400], ["Source Serif 4", '"Source Serif 4 Variable"', 400], ["Cormorant", '"Cormorant Garamond Variable"', 400]];
const sans = [["Inter Tight", '"Inter Tight Variable"'], ["Hanken Grotesk", '"Hanken Grotesk Variable"'], ["Onest", '"Onest Variable"'], ["Host Grotesk", '"Host Grotesk Variable"'], ["Schibsted Grotesk", '"Schibsted Grotesk Variable"'], ["Figtree", '"Figtree Variable"'], ["Funnel Display", '"Funnel Display Variable"'], ["Albert Sans", '"Albert Sans Variable"'], ["Geist", '"Geist Variable"']];
export default function Page() {
  return (
    <main style={{ padding: 28, background: "#FAF8F4", color: "#171410", fontFamily: "system-ui" }}>
      <h2 style={{ font: "600 14px system-ui", margin: "0 0 14px" }}>SERIFS: hero headline, 64px, plus numerals and a name</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
        {serifs.map(([n, f, w]) => (
          <div key={n as string} style={{ borderTop: "1px solid #ddd", paddingTop: 10 }}>
            <small style={{ color: "#777" }}>{n as string}</small>
            <div style={{ fontFamily: f as string, fontWeight: w as number, fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.02em" }}>Invitations worth opening.</div>
            <div style={{ fontFamily: f as string, fontWeight: w as number, fontSize: 30, marginTop: 8 }}>Amina &amp; Yusuf · 12 June 2027 · 0123</div>
          </div>
        ))}
      </div>
      <h2 style={{ font: "600 14px system-ui", margin: "36px 0 14px" }}>SANS: UI at 16px and a 40px heading</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
        {sans.map(([n, f]) => (
          <div key={n} style={{ borderTop: "1px solid #ddd", paddingTop: 10 }}>
            <small style={{ color: "#777" }}>{n}</small>
            <div style={{ fontFamily: f, fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Your guests, counted.</div>
            <p style={{ fontFamily: f, fontSize: 16, lineHeight: 1.55, margin: "8px 0 0", maxWidth: 360 }}>Every household gets a private link. Reply for each person and each event. 12 coming, 3 can’t, 5 waiting.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, fontFamily: f, fontSize: 14, fontWeight: 500 }}><span style={{ background: "#171410", color: "#fff", padding: "10px 16px", borderRadius: 8 }}>Start your invitation</span><span style={{ border: "1px solid #ccc", padding: "10px 16px", borderRadius: 8 }}>Browse designs</span></div>
          </div>
        ))}
      </div>
    </main>
  );
}
