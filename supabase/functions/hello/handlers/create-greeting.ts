import { z } from "zod";

import type { AuthContext } from "../../_shared/auth.ts";
import { json } from "../../_shared/http.ts";

const createGreetingSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function createGreeting(ctx: AuthContext, req: Request) {
  const body = await req.json();
  const result = createGreetingSchema.safeParse(body);

  if (!result.success) {
    return json({ error: z.flattenError(result.error) }, 400);
  }

  return json({ message: `Hello, ${result.data.name}!`, from: ctx.user.email });
}
