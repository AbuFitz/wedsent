import { describe, expect, it } from "vitest";
import { guestProgress } from "@/lib/guest-progress";

describe("guest progress", () => {
  it("does not mistake an opened link for attendance", () => {
    expect(guestProgress([{ events: [{ status: null }, { status: null }] }])).toEqual({ invited: 2, replied: 0, awaiting: 2, attending: 0, declined: 0 });
  });
  it("counts each person's event responses independently", () => {
    expect(guestProgress([
      { events: [{ status: "attending" }, { status: "declined" }] },
      { events: [{ status: "attending" }, { status: null }] },
    ])).toEqual({ invited: 4, replied: 3, awaiting: 1, attending: 2, declined: 1 });
  });
  it("keeps uninvited people out of event totals", () => {
    expect(guestProgress([{ events: [] }])).toEqual({ invited: 0, replied: 0, awaiting: 0, attending: 0, declined: 0 });
  });
});
