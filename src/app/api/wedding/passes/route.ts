import { api, json, mine } from "@/server/api";
import { issueAdmissionPass, listAdmissionPasses } from "@/server/admissions";

export const GET = api(async () => { const { user, weddingId } = await mine(); return { passes: await listAdmissionPasses(user.id, weddingId) }; });
export const POST = api(async (req) => { const { user, weddingId } = await mine(); return { pass: await issueAdmissionPass(user.id, weddingId, await json(req)) }; });
