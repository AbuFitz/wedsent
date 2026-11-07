import { api, ip, json } from "@/server/api";
import { setSessionCookie, signUp } from "@/server/auth";
export const POST = api(async (req) => {
  const b = await json(req);
  const { user, token } = await signUp(String(b.email ?? ""), String(b.password ?? ""), ip(req));
  await setSessionCookie(token);
  return { user };
});
