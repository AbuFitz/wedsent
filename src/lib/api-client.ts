export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: any) { super(message); }
}
export async function call<T = any>(method: string, url: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { method, headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
  } catch {
    throw new ApiError(0, "offline", "You appear to be offline. Check your connection and try again.");
  }
  const ct = res.headers.get("content-type") ?? "";
  const data = ct.includes("json") ? await res.json() : await res.text();
  if (!res.ok) {
    const e = (data as any)?.error;
    throw new ApiError(res.status, e?.code ?? "error", e?.message ?? "Something went wrong.", e?.details);
  }
  return data as T;
}
