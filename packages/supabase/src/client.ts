import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types.gen";

/** Create a typed Supabase client. Each app calls this with its own env vars. */
export function createSupabaseClient(url: string, key: string) {
  return createClient<Database>(url, key);
}
