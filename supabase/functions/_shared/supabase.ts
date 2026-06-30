import { createClient } from "@supabase/supabase-js";

import { env } from "./env.ts";

/** Create a user-scoped Supabase client (anon key + auth header). */
export function createUserClient(authHeader: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
}

/** Create a service-scoped Supabase client (service role key). */
export function createServiceClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
