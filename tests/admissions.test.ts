import { describe, expect, it } from "vitest";
import { newOwner } from "./helpers";
import { createEvent, createHousehold, listHouseholds } from "@/server/guests";
import { checkinGuests, issueAdmissionPass, listAdmissionPasses, listCheckins } from "@/server/admissions";

const errorCode = (p: Promise<unknown>) => p.then(() => "ok", (e) => e.code ?? e.message);

describe("event admission", () => {
  it("issues scoped passes, admits split arrivals, rejects repeat scans and foreign people", async () => {
    const owner = await newOwner();
    const other = await newOwner();
    const ev = await createEvent(owner.user.id, owner.weddingId, { title: "Nikah" });
    const second = await createEvent(owner.user.id, owner.weddingId, { title: "Walima" });
    await createHousehold(owner.user.id, owner.weddingId, { name: "Ali family", eventIds: [ev], guests: [{ name: "A" }, { name: "B" }] });
    await createHousehold(owner.user.id, owner.weddingId, { name: "Other family", eventIds: [ev], guests: [{ name: "C" }] });
    const households = await listHouseholds(owner.user.id, owner.weddingId, "https://example.test");
    const first = households[0];
    const outsider = households[1].guests[0].id;
    const pass = await issueAdmissionPass(owner.user.id, owner.weddingId, { eventId: ev, householdId: first.id });
    expect((await listAdmissionPasses(owner.user.id, owner.weddingId))[0].id).toBe(pass.id);
    expect(await errorCode(issueAdmissionPass(owner.user.id, owner.weddingId, { eventId: ev, householdId: first.id }))).toBe("pass_exists");
    expect(await errorCode(checkinGuests(other.user.id, owner.weddingId, { eventId: ev, token: pass.token, guestIds: [first.guests[0].id] }))).toBe("not_found");
    expect(await errorCode(checkinGuests(owner.user.id, owner.weddingId, { eventId: second, token: pass.token, guestIds: [first.guests[0].id] }))).toBe("not_found");
    const one = await checkinGuests(owner.user.id, owner.weddingId, { eventId: ev, token: pass.token, guestIds: [first.guests[0].id, outsider] });
    expect(one).toEqual({ admitted: [first.guests[0].id], alreadyCheckedIn: [], rejected: [outsider] });
    const two = await checkinGuests(owner.user.id, owner.weddingId, { eventId: ev, token: pass.token, guestIds: first.guests.map((g) => g.id) });
    expect(two.admitted).toEqual([first.guests[1].id]);
    expect(two.alreadyCheckedIn).toEqual([first.guests[0].id]);
    expect(await listCheckins(owner.user.id, owner.weddingId, ev)).toHaveLength(2);
    const rotated = await issueAdmissionPass(owner.user.id, owner.weddingId, { eventId: ev, householdId: first.id, rotate: true });
    expect(rotated.token).not.toBe(pass.token);
    expect((await checkinGuests(owner.user.id, owner.weddingId, { eventId: ev, token: pass.token, guestIds: [first.guests[1].id] })).reason).toBe("pass_inactive");
  });
});
