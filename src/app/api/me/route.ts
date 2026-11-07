import { api } from "@/server/api";
import { currentUser } from "@/server/auth";
export const GET = api(async () => ({ user: await currentUser() }));
