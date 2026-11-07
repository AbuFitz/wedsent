export class AppError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}
export const notFound = (m = "Not found") => new AppError(404, "not_found", m);
export const forbidden = (m = "Not allowed") => new AppError(403, "forbidden", m);
export const bad = (m: string, d?: unknown) => new AppError(400, "invalid", m, d);
export const conflict = (code: string, m: string, d?: unknown) => new AppError(409, code, m, d);
