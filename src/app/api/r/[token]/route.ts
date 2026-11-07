import { api } from "@/server/api";
import { guestView } from "@/server/rsvp";
export const GET = api<{ token: string }>(async (_r, { params }) => guestView(params.token));
