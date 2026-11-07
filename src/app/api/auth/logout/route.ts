import { api } from "@/server/api";
import { signOut } from "@/server/auth";
export const POST = api(async () => { await signOut(); });
