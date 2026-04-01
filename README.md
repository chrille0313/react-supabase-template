# React Supabase Template

A production-ready monorepo template for building web applications with React, Vite, TanStack, shadcn/ui, and Supabase.

## Stack

- **React 19** + **TypeScript 6** (strict mode)
- **Vite 8** — build tooling with HMR
- **TanStack Router** — type-safe file-based routing with auto code splitting
- **TanStack Query** — server state management and caching
- **TanStack Form** — type-safe forms with Zod validation
- **shadcn/ui** — accessible UI components built on Radix UI + Tailwind CSS v4
- **Supabase** — auth, database, edge functions
- **Zod 4** — schema validation
- **T3 Env** — type-safe environment variables (strict mode)
- **Turborepo** — monorepo task orchestration with caching
- **ESLint** + **Prettier** — linting and formatting
- **Commitlint** + **Husky** — conventional commit messages
- **pnpm 10** — package manager

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 10
- [Docker](https://www.docker.com/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (installed via pnpm)

## Quick Start

1. Click **"Use this template"** on GitHub to create a new repository
2. Clone your new repository
3. Run the setup script to rename the project (uses directory name by default):
   ```bash
   bash scripts/setup.sh
   # or with a custom name:
   bash scripts/setup.sh my-project-name
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start local Supabase (requires Docker):
   ```bash
   pnpm db:start
   ```
5. Generate TypeScript types from the database schema:
   ```bash
   pnpm db:gen-types
   ```
6. Start the development server:
   ```bash
   pnpm dev
   ```

The app runs at `http://localhost:8080` by default (configurable in `apps/web/.env`).

## Project Structure

```
├── apps/
│   └── web/                        # Main React application
│       ├── src/
│       │   ├── auth/               # Auth domain (vertical slice)
│       │   │   ├── components/     # Login, signup forms
│       │   │   ├── queries.ts      # TanStack Query queries
│       │   │   ├── mutations.ts    # Supabase mutations
│       │   │   ├── hooks.ts        # useUser, useSignIn, etc.
│       │   │   └── schemas.ts      # Zod validation schemas
│       │   ├── integrations/       # Third-party service wiring
│       │   │   ├── supabase/       # Supabase client + generated types
│       │   │   ├── tanstack-query/ # QueryClient + devtools plugin
│       │   │   └── tanstack-router/# Router config + devtools plugin
│       │   └── routes/             # File-based routes (TanStack Router)
│       │       ├── auth/           # /auth/login, /auth/signup, etc.
│       │       └── _authenticated/ # Protected routes (requires login)
│       ├── .env                    # Public env vars (committed)
│       └── .env.development        # Local dev overrides (committed)
├── packages/
│   ├── ui/                         # Shared shadcn/ui components
│   └── eslint-config/              # Shared ESLint configuration
├── supabase/                       # Supabase config, migrations, edge functions
│   ├── config.toml                 # Supabase configuration
│   ├── migrations/                 # SQL migrations
│   ├── functions/                  # Edge functions (Deno runtime)
│   └── seed.sql                    # Seed data for local dev
└── .github/
    ├── actions/setup/              # Shared CI setup (composite action)
    └── workflows/                  # CI/CD workflows
```

### Vertical Slice Architecture

Feature code is organized by domain, not by technology. Each domain gets its own directory directly under `src/`:

```
src/auth/
  ├── components/     # Domain-specific UI components
  ├── queries.ts      # TanStack Query queries
  ├── mutations.ts    # TanStack Query mutations
  ├── hooks.ts        # React hooks
  └── schemas.ts      # Zod schemas
```

## Environment Variables

Environment variables are managed with [T3 Env](https://env.t3.gg/) for type-safe validation. The schema is defined in `apps/web/src/env.ts`.

| File | Purpose | Committed |
|------|---------|-----------|
| `apps/web/.env` | Public variables (host, port, Supabase URL) | Yes |
| `apps/web/.env.development` | Local dev overrides (local Supabase credentials) | Yes |
| `apps/web/.env.local` | Private overrides (never committed) | No |

To add a new env var:
1. Add it to the schema in `src/env.ts`
2. Add it to `runtimeEnvStrict` in the same file
3. Set its value in the appropriate `.env` file

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm lint` | ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm test` | Run tests |
| `pnpm db:start` | Start local Supabase |
| `pnpm db:stop` | Stop local Supabase |
| `pnpm db:reset` | Reset local database |
| `pnpm db:gen-types` | Generate TypeScript types from Supabase schema |

## Key Patterns

### Adding a New Domain

Create a new directory under `src/` with the standard files:

```
src/todos/
  ├── components/
  │   └── todo-list.tsx
  ├── queries.ts
  ├── mutations.ts
  ├── hooks.ts
  └── schemas.ts
```

### Adding a Route

Create a file in `src/routes/`. The TanStack Router plugin auto-generates the route tree:

- `src/routes/todos.tsx` — public route at `/todos`
- `src/routes/_authenticated/settings.tsx` — protected route at `/settings`

### Adding a shadcn Component

Run the CLI from the web app (components are installed into `packages/ui`):

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog
```

Then import in your app code:

```tsx
import { Dialog } from "@workspace/ui/components/dialog";
```

### Protected Routes

Any route under `src/routes/_authenticated/` is automatically protected. The auth guard redirects unauthenticated users to `/auth/login`.

### Commit Messages

This project uses [conventional commits](https://www.conventionalcommits.org/) enforced by commitlint + husky. Examples:

```
feat: add user profile page
fix: resolve login redirect loop
chore: update dependencies
refactor: extract auth hooks
```

## Supabase

### Local Development

```bash
# Start local Supabase (requires Docker)
pnpm db:start

# Create a migration
cd supabase
npx supabase migration new my_migration

# Reset database (runs migrations + seed)
pnpm db:reset

# Generate TypeScript types
pnpm db:gen-types
```

Email confirmation is disabled locally for convenience. Emails can be viewed in the Inbucket UI at `http://localhost:54324`.

### Edge Functions

Edge functions live in `supabase/functions/` and run on the Deno runtime. They have their own tooling separate from the Node.js workspace.

## CI/CD

### Pull Request Checks

The following checks run in parallel on every PR:

| Workflow | File | Description |
|----------|------|-------------|
| **Typecheck** | `typecheck.yml` | TypeScript type checking |
| **Lint** | `lint.yml` | ESLint |
| **Format** | `format.yml` | Prettier formatting check |
| **Build** | `build.yml` | Production build |
| **Commitlint** | `commitlint.yml` | Validates all PR commit messages |
| **Generate Types** | `generate-types.yml` | Checks Supabase types haven't drifted (only runs when `supabase/` or types file changes) |

All workflows use a shared composite action (`.github/actions/setup/`) for pnpm + Node setup.

### Deployment

Supabase deploys automatically on push to `main` or `develop` via `deploy-supabase.yml`. It pushes config, database migrations, and edge functions.

The workflow uses **GitHub Environments** for environment-specific secrets:

#### Setting Up GitHub Environments

1. Go to your repo's **Settings > Environments**
2. Create two environments: `production` and `staging`
3. For each environment, add:

| Type | Name | Description |
|------|------|-------------|
| Variable | `SUPABASE_PROJECT_REF` | Your Supabase project reference ID |
| Secret | `SUPABASE_ACCESS_TOKEN` | From [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |

4. (Optional) Add secrets for any `env()` references in `supabase/config.toml`:

| Secret | Used by |
|--------|---------|
| `SMTP_PASSWORD` | Email SMTP |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | Google OAuth |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` | Google OAuth |
| `TURNSTILE_SECRET` | Captcha |

5. (Recommended) Add **required reviewers** on the `production` environment to gate production deploys.

#### Branch to Environment Mapping

| Branch | Environment | Supabase Remote |
|--------|-------------|-----------------|
| `main` | `production` | `[remotes.production]` in `config.toml` |
| `develop` / `development` | `staging` | `[remotes.staging]` in `config.toml` |

### Frontend Deployment

Deploy `apps/web` to your platform of choice:

- **Vercel** — auto-detects Vite, set root directory to `apps/web`
- **Netlify** — set build command to `pnpm build` and publish directory to `apps/web/dist`
- **Cloudflare Pages** — set build command to `pnpm build` and output directory to `apps/web/dist`
