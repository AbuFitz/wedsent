import { notFound } from "next/navigation";
// Internal QA pages (design contact sheets). Never served in production.
export default function Layout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
