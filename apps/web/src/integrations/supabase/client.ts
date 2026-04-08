import { createSupabaseClient } from "@workspace/supabase/client";

import { env } from "@/env";

export const supabase = createSupabaseClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
