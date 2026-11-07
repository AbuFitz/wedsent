import { api, ip, json } from "@/server/api";
import { setSessionCookie, signIn } from "@/server/auth";
export const POST = api(async (req) => {
  const b = await json(req);
  const { user, token } = await signIn(String(b.email ?? ""), String(b.password ?? ""), ip(req));
  await setSessionCookie(token);
  return { user };
});
