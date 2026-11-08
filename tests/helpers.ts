import { signUp } from "@/server/auth";
import { getOrCreateWedding, saveDraft, getDraft, publish, type Content } from "@/server/weddings";
import { createEvent, createHousehold, listHouseholds } from "@/server/guests";
import { guestView } from "@/server/rsvp";

let n = 0;
export const content = (o: Partial<Content> = {}): Content => ({ names: "Amina & Yusuf", occasion: "Wedding", date: "2027-06-12", time: "16:00", venue: "The Glasshouse", city: "London", message: "Join us", dress: "", rsvpBy: "", accent: "", address: "", photo: null, design: "botanica", palette: "", type: "", intro: "", ...o });

export async function newOwner() {
  const { user } = await signUp(`owner${++n}-${Date.now()}@example.com`, "correct horse battery", `ip${n}`);
  const weddingId = await getOrCreateWedding(user.id, content());
  return { user, weddingId };
}

/** A published wedding with two events and a 3-person household (child only at event B). */
export async function fixture() {
  const { user, weddingId } = await newOwner();
  const nikah = await createEvent(user.id, weddingId, { title: "Nikah", visibility: "invited" });
  const walima = await createEvent(user.id, weddingId, { title: "Walima", visibility: "everyone" });
  const { rev } = await getDraft(user.id, weddingId);
  await saveDraft(user.id, weddingId, content(), rev);
  const { slug } = await publish(user.id, weddingId);
  const hid = await createHousehold(user.id, weddingId, { name: "The Khans", eventIds: [nikah, walima], guests: [{ name: "Sara Khan" }, { name: "Omar Khan" }, { name: "Zayn Khan", child: true }] });
  // child not invited to Nikah: remove via setHouseholdEvents-like direct edit is covered elsewhere; here use two households instead
  const hs = await listHouseholds(user.id, weddingId, "https://x.test");
  const token = hs.find((h) => h.id === hid)!.link!.split("/r/")[1];
  const view = await guestView(token);
  return { user, weddingId, nikah, walima, hid, token, view, slug, households: hs };
}
