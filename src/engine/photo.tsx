import type { CSSProperties } from "react";
import type { Photo } from "@/lib/designs";

/** A cover photograph filling its box, cropped around the focal point. */
export function PhotoFill({ photo, className, style, alt = "" }: { photo: Photo; className?: string; style?: CSSProperties; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={photo.src} alt={alt} decoding="async" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${photo.fx}% ${photo.fy}%`, display: "block", ...style }} />;
}
