import { describe, expect, it } from "vitest";
import { readFeedbackLink } from "@/lib/feedback-share";
import { defaults } from "@/lib/designs";

describe("shareable feedback drafts", () => {
  it("decodes a Unicode invitation without any private photo or recording", () => {
    const data = { ...defaults, names: "Aisha & Yusuf", intro: "بسم الله الرحمن الرحيم", photo: { src: "data:image/png;base64,private", fx: 50, fy: 50 } };
    const payload = { v: 1, data, events: [{ id: "event", title: "Nikah", startsOn: "2027-06-12", startsAt: null, venue: "Hall", city: "London" }] };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const view = readFeedbackLink(encoded);
    expect(view?.data.names).toBe("Aisha & Yusuf");
    expect(view?.data.intro).toBe("بسم الله الرحمن الرحيم");
    expect(view?.data.photo).toBeNull();
    expect(view?.events[0].title).toBe("Nikah");
  });
  it("rejects broken or excessive links", () => {
    expect(readFeedbackLink("bad")).toBeNull();
    expect(readFeedbackLink("a".repeat(10001))).toBeNull();
  });
});
