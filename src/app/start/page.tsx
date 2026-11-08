import type { Metadata } from "next";
import { Suspense } from "react";
import { Start } from "./start";
export const metadata: Metadata = { title: "Start your invitation — Wedsent", description: "Answer a few questions and watch your invitation come together." };
export default function Page() { return <Suspense fallback={null}><Start /></Suspense>; }
