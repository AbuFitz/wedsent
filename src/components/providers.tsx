"use client";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { installAudioFocus } from "@/lib/audio-focus";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => installAudioFocus(), []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
