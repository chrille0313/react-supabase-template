# React Supabase Template

## Architecture

This is a pnpm monorepo with Turborepo:

- `apps/` — Applications
- `packages/` — Shared libraries
- `supabase/` — Supabase config, migrations, edge functions (Deno runtime, NOT a workspace package)

## Conventions

- Group feature code by domain (vertical slices), not by technology.
- Use `pnpm`, never `npm` or `yarn`.

## Environment & secrets

- Each deployable validates its env once in an `env.ts` (zod handles defaults, coercion, validation) and exports a typed `env`. Nothing else reads `import.meta.env` / `Deno.env` for config — import `env` instead. (Vite's built-in flags like `import.meta.env.DEV` are fine.)
- Multiple environments use the standard `.env` cascade (`.env` committed defaults → `.env.<mode>` → `.env.local` gitignored secrets); real process env wins. Loaded by Vite (web) and the edge runtime (supabase functions).
- Supabase `config.toml` secrets use `env(VAR)`; mirror them as `secrets.*` in `deploy-supabase.yml`.

## Commands

See `scripts` in the root `package.json` for all available commands. Use `pnpm <script>` to run them.
