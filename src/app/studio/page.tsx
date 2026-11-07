import { Suspense } from "react";
import { Studio } from "./studio";

export const metadata = { title: "Studio — Wedsent" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Studio />
    </Suspense>
  );
}
