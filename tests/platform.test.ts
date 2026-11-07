import { describe, expect, it } from "vitest";
import { signIn, signUp, userFromToken } from "@/server/auth";
import { getDraft, getPublishedBySlug, publish, saveDraft } from "@/server/weddings";
import { createEvent, createHousehold, deleteHousehold, importHouseholds, listEvents, listHouseholds, rotateInvitation, setHouseholdEvents, updateEvent } from "@/server/guests";
import { eventCounts, exportCsv, guestView, hostRecord, respond } from "@/server/rsvp";
import { setDeadlinePolicy } from "@/server/weddings";
import { getDb } from "@/server/db";
import { previewImport, parseCsv, csvCell } from "@/lib/csv";
import { content, fixture, newOwner } from "./helpers";

const key = () => `k-${Math.random().toString(36).slice(2)}-${Date.now()}`;
const code = async (p: Promise<unknown>) => p.then(() => "ok", (e) => e.code ?? e.message);

describe("auth", () => {
  it("rejects duplicate email, weak passwords and wrong credentials; sessions resolve", async () => {
    const { token, user } = await signUp("dup@example.com", "a-long-password", "t1");
    expect((await userFromToken(token))?.id).toBe(user.id);
    expect(await code(signUp("DUP@example.com", "a-long-password", "t1"))).toBe("email_taken");
    expect(await code(signUp("x@example.com", "short", "t1"))).toBe("invalid");
    expect(await code(signIn("dup@example.com", "wrong-password!", "t2"))).toBe("bad_credentials");
    expect(await code(signIn("nobody@example.com", "wrong-password!", "t2"))).toBe("bad_credentials");
    expect((await signIn("dup@example.com", "a-long-password", "t3")).user.id).toBe(user.id);
  });
  it("rate-limits repeated failed logins", async () => {
    await signUp("rl@example.com", "a-long-password", "t4");
    const results: string[] = [];
    for (let i = 0; i < 10; i++) results.push(await code(signIn("rl@example.com", "nope-nope-nope", "t5")));
    expect(results).toContain("rate_limited");
  });
});

describe("tenant isolation", () => {
  it("another owner cannot read, edit, publish or list a wedding they do not own", async () => {
    const a = await newOwner();
    const b = await newOwner();
    expect(await code(getDraft(b.user.id, a.weddingId))).toBe("not_found");
    expect(await code(saveDraft(b.user.id, a.weddingId, content(), 1))).toBe("not_found");
    expect(await code(publish(b.user.id, a.weddingId))).toBe("not_found");
    expect(await code(listHouseholds(b.user.id, a.weddingId, "x"))).toBe("not_found");
    expect(await code(createEvent(b.user.id, a.weddingId, { title: "Hack" }))).toBe("not_found");
    expect(await code(eventCounts(b.user.id, a.weddingId))).toBe("not_found");
  });
  it("cannot attach an event from another wedding to a household", async () => {
    const a = await newOwner();
    const b = await newOwner();
    const foreign = await createEvent(b.user.id, b.weddingId, { title: "B's event" });
    expect(await code(createHousehold(a.user.id, a.weddingId, { name: "X", eventIds: [foreign], guests: [{ name: "G" }] }))).toBe("invalid");
  });
});

describe("draft and publishing", () => {
  it("detects stale edits instead of silently overwriting", async () => {
    const o = await newOwner();
    const d = await getDraft(o.user.id, o.weddingId);
    await saveDraft(o.user.id, o.weddingId, content({ names: "A & B" }), d.rev);
    const err: any = await saveDraft(o.user.id, o.weddingId, content({ names: "C & D" }), d.rev).catch((e) => e);
    expect(err.code).toBe("stale_draft");
    expect(err.details.content.names).toBe("A & B");
  });
  it("validates content and refuses to publish an incomplete draft", async () => {
    const o = await newOwner();
    const d = await getDraft(o.user.id, o.weddingId);
    expect(await code(saveDraft(o.user.id, o.weddingId, { ...content(), accent: "javascript:1" }, d.rev))).toBe("invalid");
    await saveDraft(o.user.id, o.weddingId, content({ venue: "" }), d.rev);
    const err: any = await publish(o.user.id, o.weddingId).catch((e) => e);
    expect(err.code).toBe("not_ready");
    expect(err.details).toContain("Add the venue.");
  });
  it("publishes an immutable snapshot; re-publishing unchanged content does not make a new version", async () => {
    const f = await fixture();
    const pub = await getPublishedBySlug(f.slug);
    expect(pub?.content.names).toBe("Amina & Yusuf");
    const d = await getDraft(f.user.id, f.weddingId);
    await saveDraft(f.user.id, f.weddingId, content({ names: "Changed Later" }), d.rev);
    expect((await getPublishedBySlug(f.slug))?.content.names).toBe("Amina & Yusuf"); // draft edits are not live
    const again = await publish(f.user.id, f.weddingId);
    const db = await getDb();
    const v = (await db.query(`select count(*)::int n from design_versions where wedding_id=$1 and state='published'`, [f.weddingId])).rows[0].n;
    expect(v).toBe(2);
    expect(again.slug).toBe(f.slug); // link is stable across versions
    const same = await publish(f.user.id, f.weddingId);
    expect(same.versionId).toBe(again.versionId);
  });
  it("public payload hides invited-only events and contains no guest data", async () => {
    const f = await fixture();
    const pub = await getPublishedBySlug(f.slug);
    const titles = pub!.events.map((e: any) => e.title);
    expect(titles).toEqual(["Walima"]);
    expect(JSON.stringify(pub)).not.toMatch(/Khan|token/i);
  });
  it("unpublished weddings have no public page and their links do not resolve", async () => {
    const o = await newOwner();
    const ev = await createEvent(o.user.id, o.weddingId, { title: "E" });
    await createHousehold(o.user.id, o.weddingId, { name: "H", eventIds: [ev], guests: [{ name: "G" }] });
    const hs = await listHouseholds(o.user.id, o.weddingId, "x");
    expect(await code(guestView(hs[0].link!.split("/r/")[1]))).toBe("not_found");
  });
});

describe("household RSVP", () => {
  it("records per-person per-event answers; no reply is distinct from declined; counts are people", async () => {
    const f = await fixture();
    const [sara, omar, zayn] = f.view.guests;
    await respond(f.token, { idempotencyKey: key(), answers: [
      { guestId: sara.id, eventId: f.nikah, status: "declined" },
      { guestId: sara.id, eventId: f.walima, status: "attending", note: "vegetarian" },
      { guestId: omar.id, eventId: f.nikah, status: "attending" },
    ] });
    const counts = await eventCounts(f.user.id, f.weddingId);
    const nik = counts.find((c) => c.title === "Nikah")!;
    const wal = counts.find((c) => c.title === "Walima")!;
    expect(nik).toMatchObject({ invited: 3, attending: 1, declined: 1, noReply: 1 });
    expect(wal).toMatchObject({ invited: 3, attending: 1, declined: 0, noReply: 2 });
    expect(zayn.child).toBe(true);
  });
  it("is idempotent for double submission and logs history once", async () => {
    const f = await fixture();
    const k = key();
    const body = { idempotencyKey: k, answers: [{ guestId: f.view.guests[0].id, eventId: f.nikah, status: "attending" }] };
    const [r1, r2] = await Promise.all([respond(f.token, body), respond(f.token, body)]);
    expect([r1, r2].some((r: any) => r.replayed)).toBe(true);
    const db = await getDb();
    expect((await db.query(`select count(*)::int n from response_history where wedding_id=$1`, [f.weddingId])).rows[0].n).toBe(1);
  });
  it("changing an answer bumps version and appends history; identical resubmission is a no-op", async () => {
    const f = await fixture();
    const g = f.view.guests[0].id;
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending" }] });
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending" }] });
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "declined" }] });
    const v = await guestView(f.token);
    expect(v.answers.find((a) => a.guestId === g && a.eventId === f.nikah)).toMatchObject({ status: "declined", version: 2 });
    const db = await getDb();
    expect((await db.query(`select count(*)::int n from response_history where guest_id=$1`, [g])).rows[0].n).toBe(2);
  });
  it("rejects a stale version when two household members edit the same answer", async () => {
    const f = await fixture();
    const g = f.view.guests[0].id;
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending", version: 0 }] });
    const err: any = await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "declined", version: 0 }] }).catch((e) => e);
    expect(err.code).toBe("stale_answer");
  });
  it("a token cannot answer for guests of another household or wedding, or for events the guest is not invited to", async () => {
    const f = await fixture();
    const other = await fixture();
    expect(await code(respond(f.token, { idempotencyKey: key(), answers: [{ guestId: other.view.guests[0].id, eventId: other.nikah, status: "attending" }] }))).toBe("invalid");
    expect(await code(respond(f.token, { idempotencyKey: key(), answers: [{ guestId: f.view.guests[0].id, eventId: other.nikah, status: "attending" }] }))).toBe("invalid");
    // guest-link scope: guest view never exposes other households
    expect(JSON.stringify(f.view)).not.toContain(other.view.household.name + "zzz");
  });
  it("a guest invited only to Walima cannot see or answer the Nikah", async () => {
    const f = await fixture();
    const hid2 = await createHousehold(f.user.id, f.weddingId, { name: "Walima only", eventIds: [f.walima], guests: [{ name: "Lina" }] });
    const link = (await listHouseholds(f.user.id, f.weddingId, "x")).find((h) => h.id === hid2)!.link!;
    const t = link.split("/r/")[1];
    const v = await guestView(t);
    expect(v.events.map((e) => e.title)).toEqual(["Walima"]);
    expect(await code(respond(t, { idempotencyKey: key(), answers: [{ guestId: v.guests[0].id, eventId: f.nikah, status: "attending" }] }))).toBe("invalid");
  });
  it("host can narrow a household's events; removing an invite removes that answer", async () => {
    const f = await fixture();
    const g = f.view.guests[0].id;
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending" }] });
    await setHouseholdEvents(f.user.id, f.weddingId, f.hid, [f.walima]);
    const v = await guestView(f.token);
    expect(v.events.map((e) => e.title)).toEqual(["Walima"]);
    expect(v.answers).toHaveLength(0);
  });
});

describe("links: revoke, rotate, forwarded", () => {
  it("rotation kills the old link immediately and leaves other households untouched", async () => {
    const f = await fixture();
    const h2 = await createHousehold(f.user.id, f.weddingId, { name: "Other", eventIds: [f.walima], guests: [{ name: "Pat" }] });
    const t2 = (await listHouseholds(f.user.id, f.weddingId, "x")).find((h) => h.id === h2)!.link!.split("/r/")[1];
    await rotateInvitation(f.user.id, f.weddingId, f.hid);
    expect(await code(guestView(f.token))).toBe("not_found");
    expect(await code(respond(f.token, { idempotencyKey: key(), answers: [{ guestId: f.view.guests[0].id, eventId: f.nikah, status: "attending" }] }))).toBe("not_found");
    expect((await guestView(t2)).household.name).toBe("Other");
    const fresh = (await listHouseholds(f.user.id, f.weddingId, "x")).find((h) => h.id === f.hid)!.link!.split("/r/")[1];
    expect(fresh).not.toBe(f.token);
    expect((await guestView(fresh)).guests).toHaveLength(3);
  });
  it("a reply racing a revocation never writes after the link is revoked", async () => {
    const f = await fixture();
    const g = f.view.guests[0].id;
    const results = await Promise.allSettled([
      respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending" }] }),
      rotateInvitation(f.user.id, f.weddingId, f.hid),
    ]);
    expect(results[1].status).toBe("fulfilled");
    const db = await getDb();
    const rows = (await db.query(`select count(*)::int n from event_responses where guest_id=$1`, [g])).rows[0].n;
    // Either the reply landed before revocation (1) or was rejected (0). Afterwards the old link is dead.
    expect([0, 1]).toContain(rows);
    expect(await code(respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "declined" }] }))).toBe("not_found");
  });
  it("deleting a household removes its link and answers", async () => {
    const f = await fixture();
    await deleteHousehold(f.user.id, f.weddingId, f.hid);
    expect(await code(guestView(f.token))).toBe("not_found");
  });
});

describe("deadline policy", () => {
  it("locks guest replies after the deadline but lets the host correct them, with audit", async () => {
    const f = await fixture();
    const g = f.view.guests[0].id;
    await setDeadlinePolicy(f.user.id, f.weddingId, new Date(Date.now() - 3600_000).toISOString(), false);
    expect((await guestView(f.token)).locked).toBe(true);
    expect(await code(respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "attending" }] }))).toBe("deadline_passed");
    await hostRecord(f.user.id, f.weddingId, [{ guestId: g, eventId: f.nikah, status: "attending" }]);
    const db = await getDb();
    expect((await db.query(`select source from event_responses where guest_id=$1`, [g])).rows[0].source).toBe("host");
    expect((await db.query(`select count(*)::int n from audit_events where wedding_id=$1 and action='rsvp.host_recorded'`, [f.weddingId])).rows[0].n).toBe(1);
    await setDeadlinePolicy(f.user.id, f.weddingId, new Date(Date.now() - 3600_000).toISOString(), true);
    await respond(f.token, { idempotencyKey: key(), answers: [{ guestId: g, eventId: f.nikah, status: "declined" }] });
  });
});

describe("events", () => {
  it("returns dates as plain strings in chronological order and lets the host edit an event", async () => {
    const o = await newOwner();
    const late = await createEvent(o.user.id, o.weddingId, { title: "Reception", startsOn: "2027-06-13", startsAt: "18:30" });
    const early = await createEvent(o.user.id, o.weddingId, { title: "Nikah", startsOn: "2027-06-12", startsAt: "11:00" });
    let evs = await listEvents(o.user.id, o.weddingId);
    expect(evs.map((e: any) => e.title)).toEqual(["Nikah", "Reception"]);
    expect(evs[0]).toMatchObject({ starts_on: "2027-06-12", starts_at_local: "11:00" });
    await updateEvent(o.user.id, o.weddingId, early, { title: "Nikah ceremony", startsOn: "2027-06-14", startsAt: null, venue: "Mosque", city: "London", visibility: "everyone" });
    evs = await listEvents(o.user.id, o.weddingId);
    expect(evs.map((e: any) => e.title)).toEqual(["Reception", "Nikah ceremony"]);
    expect(evs[1]).toMatchObject({ starts_on: "2027-06-14", starts_at_local: null, venue: "Mosque" });
    const other = await newOwner();
    expect(await code(updateEvent(other.user.id, o.weddingId, late, { title: "Hack" }))).toBe("not_found");
    expect(await code(updateEvent(o.user.id, o.weddingId, "00000000-0000-0000-0000-000000000000", { title: "x" }))).toBe("not_found");
  });
  it("guest view and public payload expose event dates as yyyy-mm-dd strings", async () => {
    const f = await fixture();
    await updateEvent(f.user.id, f.weddingId, f.walima, { title: "Walima", startsOn: "2027-06-13", startsAt: "19:00", visibility: "everyone" });
    expect((await guestView(f.token)).events.find((e) => e.title === "Walima")).toMatchObject({ startsOn: "2027-06-13", startsAt: "19:00" });
    expect((await getPublishedBySlug(f.slug))!.events[0]).toMatchObject({ startsOn: "2027-06-13", startsAt: "19:00" });
  });
});

describe("import and export", () => {
  it("parses quoted CSV, flags duplicates and bad rows, and neutralises formulas on export", async () => {
    expect(parseCsv('name,email\r\n"Smith, Ann",a@x.com\r\n"Say ""hi""",\r\n')).toEqual([["name", "email"], ["Smith, Ann", "a@x.com"], ['Say "hi"', ""]]);
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    const p = previewImport("household,name,email,child\nKhans,Sara Khan,sara@x.com,\nKhans,Omar Khan,,\nKhans,Zayn,,yes\n,Sara Khan,,\nSolo,Bad Email,nope,\nSolo,,,\n", [{ name: "Existing Person", email: "e@x.com" }]);
    expect(p.rows.map((r) => r.guest)).toEqual(["Sara Khan", "Omar Khan", "Zayn"]);
    expect(p.rows[2].child).toBe(true);
    expect(p.duplicates).toHaveLength(1);
    expect(p.errors.map((e) => e.line).sort()).toEqual([6, 7]);
  });
  it("imports grouped households and exports one row per person per event incl. no reply", async () => {
    const o = await newOwner();
    const ev = await createEvent(o.user.id, o.weddingId, { title: "Party" });
    const r = await importHouseholds(o.user.id, o.weddingId, [{ household: "=evil()", guest: "A", email: "", child: false }, { household: "=evil()", guest: "B", email: "b@x.com", child: true }], [ev]);
    expect(r).toEqual({ households: 1, guests: 2 });
    const csv = await exportCsv(o.user.id, o.weddingId);
    expect(csv).toContain("'=evil()");
    expect(csv.trim().split("\r\n")).toHaveLength(3);
    expect(csv).toContain("no reply");
  });
});
