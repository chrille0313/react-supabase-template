import { z } from "zod";

/**
 * Validated environment for edge functions. The single source of truth for the
 * secrets the functions require. The `SUPABASE_*` values are injected by the
 * edge runtime; add new secrets here and set them with `supabase secrets set`.
 */
const EnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const raw = Object.fromEntries(Object.keys(EnvSchema.shape).map((key) => [key, Deno.env.get(key)]));

const parsed = EnvSchema.safeParse(raw);

if (!parsed.success) {
  console.error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
