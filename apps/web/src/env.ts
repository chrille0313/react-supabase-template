import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },
  // Vite inlines all import.meta.env.VITE_* at build, so the whole object can be
  // passed directly. No need to map each var as runtimeEnvStrict requires.
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
