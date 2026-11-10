/** Limit post-auth navigation to real owner routes; never redirect to an arbitrary URL. */
export function safeAuthReturn(value: string | null | undefined): string {
  if (!value || /[\\\r\n]/.test(value) || value.startsWith("//")) return "/dashboard";
  if (!/^\/(?:studio|dashboard|start)(?:[/?#]|$)/.test(value)) return "/dashboard";
  return value;
}
