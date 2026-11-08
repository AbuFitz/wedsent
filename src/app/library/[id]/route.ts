import { demoTrackById } from "@/lib/music-library";
import { createHash } from "node:crypto";

/** Fixed allowlist only: browsers fetch the MP3 from its creator's public GitHub repository. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (id === "nasheed-alhamdulillah") {
    const file = "Jawad_Syed_-_Alhamdulilah_(Vocal_Only_Nasheed).flac";
    return Response.redirect(`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`, 307);
  }
  const commonsMp3: Record<string, string> = {
    "satie-gymnopedie": "Gymnopedie No. 1..ogg",
    "chopin-nocturne": "Chopin - Nocturne Op. posth. 72 no. 1.ogg",
    "bridal-chorus": "Richard Wagner - Treulich geführt, version 2.ogg",
  };
  const commonsFile = commonsMp3[id];
  if (commonsFile) {
    const wikiName = commonsFile.replaceAll(" ", "_");
    const hash = createHash("md5").update(wikiName).digest("hex");
    const safe = encodeURIComponent(wikiName);
    return Response.redirect(`https://upload.wikimedia.org/wikipedia/commons/transcoded/${hash[0]}/${hash.slice(0, 2)}/${safe}/${safe}.mp3`, 307);
  }
  const track = demoTrackById(id);
  if (!track) return new Response("Track not found", { status: 404 });
  const upstream = `https://raw.githubusercontent.com/farmmer938-lgtm/aeris-cc0-music/main/tracks/${track.file}`;
  return Response.redirect(upstream, 307);
}
