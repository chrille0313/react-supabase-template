import { createClient } from "@supabase/supabase-js";

import { requireEnv } from "./env.ts";

/** Create a user-scoped Supabase client (anon key + auth header). */
export function createUserClient(authHeader: string) {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: authHeader } },
  });
}

/** Create a service-scoped Supabase client (service role key). */
export function createServiceClient() {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));
}
