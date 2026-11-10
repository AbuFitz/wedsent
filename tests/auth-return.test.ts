import { describe, expect, it } from "vitest";
import { safeAuthReturn } from "@/lib/auth-return";

describe("safe post-auth navigation", () => {
  it("keeps valid studio and dashboard return paths", () => {
    expect(safeAuthReturn("/studio")).toBe("/studio");
    expect(safeAuthReturn("/dashboard?tab=Guests")).toBe("/dashboard?tab=Guests");
  });
  it.each(["https://evil.test", "//evil.test", "/\\evil.test", "/api/auth/logout", "/studioevil", "\n/dashboard", null, ""])("rejects unsafe return target %s", (target) => {
    expect(safeAuthReturn(target)).toBe("/dashboard");
  });
});
