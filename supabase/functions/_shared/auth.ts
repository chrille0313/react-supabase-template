import type { AuthUser, SupabaseClient } from "@supabase/supabase-js";

import { errorResponse } from "./http.ts";
import { createUserClient } from "./supabase.ts";

export interface AuthContext {
  supabase: SupabaseClient;
  user: AuthUser;
}

export async function createAuthContext(req: Request): Promise<AuthContext | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return errorResponse("Missing authorization", 401);

  const supabase = createUserClient(authHeader);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return errorResponse("Unauthorized", 401);

  return { supabase, user };
}
