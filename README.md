# React Supabase Template

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

A production-ready monorepo template for building web applications with React, Vite, TanStack, shadcn/ui, and Supabase.

## Stack

- [**React 19**](https://react.dev/) + [**TypeScript 6**](https://www.typescriptlang.org/) (strict mode)
- [**Vite 8**](https://vite.dev/) — build tooling with HMR
- [**TanStack Router**](https://tanstack.com/router) — type-safe file-based routing with auto code splitting
- [**TanStack Query**](https://tanstack.com/query) — server state management and caching
- [**TanStack Form**](https://tanstack.com/form) — type-safe forms with Zod validation
- [**shadcn/ui**](https://ui.shadcn.com/) — accessible UI components built on Radix UI + Tailwind CSS v4
- [**Supabase**](https://supabase.com/) — auth, database, edge functions
- [**Zod 4**](https://zod.dev/) — schema validation
- [**T3 Env**](https://env.t3.gg/) — type-safe environment variables (strict mode)
- [**Turborepo**](https://turbo.build/) — monorepo task orchestration with caching
- [**oxlint**](https://oxc.rs/docs/guide/usage/linter) — fast linting with type-aware rules
- [**oxfmt**](https://oxc.rs/docs/guide/usage/formatter) — fast formatting with import and Tailwind class sorting
- [**Commitlint**](https://commitlint.js.org/) + [**Husky**](https://typicode.github.io/husky/) — conventional commit messages

## Prerequisites

- [Node.js](https://nodejs.org/) >= 24 (LTS)
- [pnpm](https://pnpm.io/) >= 10
- [Docker](https://www.docker.com/) (for local Supabase)

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
5. Start local Supabase (requires Docker):
   ```bash
   pnpm db:start
   ```
6. Generate TypeScript types from the database schema:
   ```bash
   pnpm db:gen-types
   ```
7. Start the development server:
   ```bash
   pnpm dev
   ```

The app runs at `http://localhost:8080` by default (configurable in `apps/web/.env`).

## Project Structure

```
├── .github/                        # CI/CD workflows
├── apps/
│   └── web/                        # React application
│       └── src/
│           ├── auth/               # Auth domain (vertical slice)
│           ├── integrations/       # Third-party service wiring
│           └── routes/             # File-based routes
├── packages/
│   ├── ui/                         # Shared shadcn/ui components
│   └── lint-config/                # Shared oxlint and oxfmt configuration
└── supabase/                       # Config, migrations, edge functions
```

### Vertical Slice Architecture

Feature code is organized by domain, not by technology:

```
# Good — grouped by domain
src/auth/
  ├── components/
  ├── queries.ts
  ├── mutations.ts
  ├── hooks.ts
  └── schemas.ts

# Bad — split by technology
src/
  ├── components/auth/
  ├── hooks/useAuth.ts
  ├── queries/auth.ts
  └── schemas/auth.ts
```

## Environment Variables

Managed with [T3 Env](https://env.t3.gg/docs/core) for type-safe validation. Schema is in `apps/web/src/env.ts`.

| File                        | Purpose                                          | Committed |
| --------------------------- | ------------------------------------------------ | --------- |
| `apps/web/.env`             | Public variables (host, port, Supabase URL)      | Yes       |
| `apps/web/.env.development` | Local dev overrides (local Supabase credentials) | Yes       |
| `apps/web/.env.local`       | Private overrides                                | No        |

To add a new env var:

1. Add it to the schema in `src/env.ts`
2. Add it to `runtimeEnvStrict` in the same file
3. Set its value in the appropriate `.env` file

## Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start development server                       |
| `pnpm build`        | Production build                               |
| `pnpm typecheck`    | TypeScript type checking                       |
| `pnpm lint`         | Lint with oxlint                               |
| `pnpm lint:fix`     | Lint and auto-fix                              |
| `pnpm format`       | Format with oxfmt                              |
| `pnpm format:check` | Check formatting                               |
| `pnpm test`         | Run tests                                      |
| `pnpm db:start`     | Start local Supabase                           |
| `pnpm db:stop`      | Stop local Supabase                            |
| `pnpm db:reset`     | Reset local database                           |
| `pnpm db:gen-types` | Generate TypeScript types from Supabase schema |

## Key Patterns

### Adding a Domain

Create a new directory under `src/`:

```
src/todos/
  ├── components/
  ├── queries.ts
  ├── mutations.ts
  ├── hooks.ts
  └── schemas.ts
```

### Adding a Route

Create a file in `src/routes/`. The [TanStack Router plugin](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing) auto-generates the route tree:

- `src/routes/todos.tsx` — public route at `/todos`
- `src/routes/_authenticated/settings.tsx` — protected route at `/settings`

Any route under `src/routes/_authenticated/` is automatically protected and redirects to `/auth/login`.

### Adding a shadcn Component

See [shadcn/ui docs](https://ui.shadcn.com/docs/components) for available components.

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog
```

```tsx
import { Dialog } from "@workspace/ui/components/dialog";
```

### Commit Messages

[Conventional commits](https://www.conventionalcommits.org/) enforced by commitlint + husky. See the [cheat sheet](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13) for all types.

```
feat(auth): add password reset flow
fix: resolve login redirect loop
chore(deps): update dependencies
refactor: extract session hooks
```

## Supabase

See the [Supabase local development docs](https://supabase.com/docs/guides/local-development) for more details.

### Local Development

```bash
pnpm db:start          # Start local Supabase (requires Docker)
pnpm db:reset          # Reset database (runs migrations + seed)
pnpm db:gen-types      # Generate TypeScript types

# Create a migration
cd supabase && npx supabase migration new my_migration
```

Email confirmation is disabled locally. Emails can be viewed at `http://localhost:54324`.

### Edge Functions

[Edge functions](https://supabase.com/docs/guides/functions) live in `supabase/functions/` and run on the [Deno](https://deno.com/) runtime, separate from the Node.js workspace.

## CI/CD

### Pull Request Checks

Run in parallel on every PR:

| Workflow           | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| **Typecheck**      | TypeScript type checking                                            |
| **Lint**           | oxlint with GitHub annotations                                      |
| **Format**         | oxfmt formatting check                                              |
| **Build**          | Production build                                                    |
| **Commitlint**     | Validates commit messages                                           |
| **Generate Types** | Checks Supabase types haven't drifted (only on `supabase/` changes) |

### Supabase Deployment

Deploys automatically on push to `main` or `develop` via `deploy-supabase.yml` (config, migrations, edge functions). Uses [GitHub Environments](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment) for per-environment secrets.

#### Setting Up GitHub Environments

1. Go to **Settings > Environments**, create `production` and `staging`
2. For each environment, add:

| Type     | Name                    | Description                                                                                 |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Variable | `SUPABASE_PROJECT_REF`  | Your Supabase project reference ID                                                          |
| Secret   | `SUPABASE_ACCESS_TOKEN` | From [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |

3. Add secrets for any `env()` references in `supabase/config.toml`. These correspond to features you enable in the config — common examples:

| Secret                                    | Feature                               |
| ----------------------------------------- | ------------------------------------- |
| `SMTP_PASSWORD`                           | Email delivery ([auth.email.smtp])    |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | Google OAuth ([auth.external.google]) |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`    | Google OAuth ([auth.external.google]) |
| `TURNSTILE_SECRET`                        | Captcha ([auth.captcha])              |

4. (Recommended) Add **required reviewers** on `production` to gate deploys

#### Branch to Environment Mapping

| Branch                    | Environment  |
| ------------------------- | ------------ |
| `main`                    | `production` |
| `develop` / `development` | `staging`    |

### Frontend Deployment

Deploy `apps/web` to your platform of choice:

- **Vercel** — set root directory to `apps/web`
- **Netlify** — build: `pnpm build`, publish: `apps/web/dist`
- **Cloudflare Pages** — build: `pnpm build`, output: `apps/web/dist`
