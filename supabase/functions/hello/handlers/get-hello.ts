import type { AuthContext } from "../../_shared/auth.ts";
import { json } from "../../_shared/http.ts";

export function getHello(ctx: AuthContext) {
  return json({ message: `Hello, ${ctx.user.email}!` });
}
