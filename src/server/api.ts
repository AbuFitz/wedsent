import { AppError } from "./errors";
import { requireUser, type User } from "./auth";
import { getOrCreateWedding, type Content } from "./weddings";
import { defaults } from "@/lib/designs";
import { hasDurableDb } from "./db";

type Ctx<P> = { params: Promise<P> };

/** Wrap a handler: CSRF origin check on writes, JSON errors, no stack leaks. */
export function api<P = Record<string, never>>(fn: (req: Request, ctx: { params: P }) => Promise<Response | unknown>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      if (!hasDurableDb()) throw new AppError(503, "backend_not_configured", "The Wedsent backend is not connected to a database yet.");
      if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        const origin = req.headers.get("origin");
        const host = req.headers.get("host");
        if (origin && host && new URL(origin).host !== host) throw new AppError(403, "bad_origin", "Cross-site request blocked.");
      }
      const out = await fn(req, { params: await ctx.params });
      return out instanceof Response ? out : Response.json(out ?? { ok: true });
    } catch (e) {
      if (e instanceof AppError) return Response.json({ error: { code: e.code, message: e.message, details: e.details } }, { status: e.status });
      console.error("api error", e);
      return Response.json({ error: { code: "server_error", message: "Something went wrong on our side. Try again." } }, { status: 500 });
    }
  };
}

export const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
export const json = async <T = any>(req: Request): Promise<T> => {
  try { return (await req.json()) as T; } catch { throw new AppError(400, "invalid_json", "Request body must be JSON."); }
};
export const origin = (req: Request) => new URL(req.url).origin;

/** The signed-in owner's wedding (one per account for now). */
export async function mine(): Promise<{ user: User; weddingId: string }> {
  const user = await requireUser();
  const weddingId = await getOrCreateWedding(user.id, defaults as Content);
  return { user, weddingId };
}
