import { demoTrackById } from "@/lib/music-library";

/** Fixed allowlist only: browsers fetch the MP3 from its creator's public GitHub repository. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const track = demoTrackById((await params).id);
  if (!track) return new Response("Track not found", { status: 404 });
  const upstream = `https://raw.githubusercontent.com/farmmer938-lgtm/aeris-cc0-music/main/tracks/${track.file}`;
  return Response.redirect(upstream, 307);
}
