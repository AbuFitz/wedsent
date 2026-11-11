import type { Metadata } from "next";
import { Suspense } from "react";
import { Start } from "./start";
export const metadata: Metadata = { title: "Start your invitation | Wedsent", description: "Add your wedding details, choose a design and preview your invitation." };
export default function Page() { return <Suspense fallback={null}><Start /></Suspense>; }
