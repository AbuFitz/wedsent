import type { Photo } from "./designs";

/** Resize in the browser (respecting EXIF orientation) so uploads stay small and fast on mobile data. */
export async function resizeImage(file: File, max = 1600, quality = 0.84): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) throw new Error("Use a JPEG, PNG or WebP photo.");
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { throw new Error("That photo couldn’t be read. Try a JPEG or PNG."); }
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Couldn’t process that photo."))), "image/jpeg", quality));
}

const toDataUrl = (b: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error("Couldn’t read that photo.")); r.readAsDataURL(b); });

/** Signed in: upload to the account and use the /media URL. Signed out: keep a small data URL in this browser's draft. */
export async function storePhoto(file: File, signedIn: boolean): Promise<Photo> {
  if (signedIn) {
    const blob = await resizeImage(file);
    const r = await fetch("/api/media", { method: "POST", body: blob, headers: { "content-type": "image/jpeg" }, credentials: "same-origin" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.error?.message ?? "Couldn’t upload that photo.");
    return { src: j.src, fx: 50, fy: 40 };
  }
  const blob = await resizeImage(file, 1200, 0.78);
  if (blob.size > 900_000) throw new Error("That photo is too large to keep on this device. Try a smaller one or create an account.");
  return { src: await toDataUrl(blob), fx: 50, fy: 40 };
}
