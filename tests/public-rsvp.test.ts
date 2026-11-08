import { describe, expect, it } from "vitest";
import { fixture, newOwner } from "./helpers";
import { createEvent } from "@/server/guests";
import { publish } from "@/server/weddings";
import { publicReply, publicReplySummary } from "@/server/public-rsvp";

const submission = (eventId: string | null) => ({ name: "A guest", email: "guest@example.com", eventId, status: "attending", note: "Vegetarian" });

describe("public link RSVP", () => {
  it("records a public declaration separately from verified guest invitations", async () => {
    const f = await fixture();
    expect(await publicReply(f.slug, submission(f.walima))).toEqual({ ok: true, unverified: true });
    const items = await publicReplySummary(f.user.id, f.weddingId);
    expect(items).toMatchObject([{ name: "A guest", event_title: "Walima", status: "attending" }]);
    expect(items[0].email).toBe("guest@example.com");
  });

  it("blocks anonymous responses to invited-only events and cross-wedding IDs", async () => {
    const f = await fixture();
    await expect(publicReply(f.slug, submission(f.nikah))).rejects.toMatchObject({ code: "invalid" });
    const other = await newOwner();
    const otherEvent = await createEvent(other.user.id, other.weddingId, { title: "Private", visibility: "everyone" });
    await expect(publicReply(f.slug, submission(otherEvent))).rejects.toMatchObject({ code: "invalid" });
  });

  it("accepts a simple wedding without a separate event and rejects invalid identity", async () => {
    const w = await newOwner();
    const { slug } = await publish(w.user.id, w.weddingId);
    await expect(publicReply(slug, submission(null))).resolves.toMatchObject({ ok: true });
    await expect(publicReply(slug, { ...submission(null), name: "A" })).rejects.toMatchObject({ code: "invalid" });
  });
});
