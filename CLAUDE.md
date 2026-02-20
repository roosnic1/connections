# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NYT Connections clone built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. The game presents a 4x4 grid of words where players find four groups of four related words. Includes a full admin panel for managing connections and a review workflow.

## Commands

```bash
npm run dev              # Development server (port 3000, Turbopack default)
npm run build            # Production build (Turbopack default)
npm run lint             # ESLint 9 (extends next/core-web-vitals)

# Prisma commands (use dotenv-cli to load .env.local)
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database (uses tsx prisma/seed.ts)
npm run prisma:studio    # Open Prisma Studio GUI
```

Note: `prisma generate` runs automatically on `npm install` (postinstall hook). Prisma 7 uses a TypeScript query engine (no Rust binary). Accelerate is configured via `accelerateUrl` in PrismaClient constructor. Prisma config (datasource URL, seed command) lives in `prisma.config.ts`. Turbopack is the default bundler in Next.js 16 (use `--webpack` flag to opt out). The proxy file (`proxy.ts`) replaces `middleware.ts` per Next.js 16 convention.

## Architecture

### Next.js

**When starting work on a Next.js project, ALWAYS call the `init` tool from
next-devtools-mcp FIRST to set up proper context and establish documentation
requirements. Do this automatically without being asked.**

### Routing & i18n

- Locale-based routing via `app/[locale]/` with next-intl proxy (formerly middleware)
- Supported languages: German (de, default), English (en)
- Locale prefix strategy: `never` (default locale omitted from URL)
- Translations via JSON files in `messages/` (next-intl)
- Language constants defined in `i18n/config.ts` (`ALL_LANGUAGES`, `DEFAULT_LANGUAGE`)

### Authentication

- **Better Auth** (`^1.4.18`) with Keycloak via OAuth2 (genericOAuth plugin)
- Server-side config in `lib/auth.ts`, client-side in `lib/auth-client.ts`
- Required env vars: `AUTH_SECRET`, `BETTER_AUTH_URL`, `AUTH_KEYCLOAK_ISSUER`, `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET`
- Auth API route: `app/api/auth/[...all]/route.ts` (handled via `toNextJsHandler`)
- Admin routes check session via `auth.api.getSession()` and redirect to `/admin/login` if unauthenticated
- Better Auth uses the Prisma adapter — schema includes `User`, `Session`, `Account`, `Verification` tables

### Data Layer

- PostgreSQL via Prisma ORM 7 with Prisma Accelerate for serverless
- Schema: `Connection` (DRAFT/REVIEW/PUBLISHED states) → `Category[]` (4 per game) → `words: String[]` (4 per category)
- Each category has a `level` (1-4) representing difficulty
- `Connection` has a state machine: `DRAFT → REVIEW → PUBLISHED`, with `publishDate`/`publishedAt` for scheduling
- Better Auth tables: `User`, `Session`, `Account`, `Verification`
- Prisma client generated to `prisma/generated/prisma/` (configured in `prisma/schema.prisma`)
- Prisma config (datasource URL, seed) in `prisma.config.ts` (loads `.env.local` via dotenv)
- Prisma singleton in `lib/prisma.ts`
- Game data fetched server-side in `app/[locale]/page.tsx`

### API Routes

- `app/api/auth/[...all]/route.ts` — Better Auth handler (GET, POST)
- `app/api/review/route.ts` — Review submission (POST only); validates and saves reviews, only accepts connections in REVIEW state

### Admin Panel

- Protected routes under `app/[locale]/admin/`
- Login page at `/admin/login` with Keycloak OAuth2
- **Connections** (`/admin/connections`): CRUD with state transitions (DRAFT → REVIEW → PUBLISHED), publication scheduling
- **Reviews** (`/admin/reviews`): View all submitted reviews, individual review detail at `/admin/reviews/[id]`
- Server Actions in `app/[locale]/admin/_actions/connections.ts` and `reviews.ts`

### Game State Management

- React Context (`GameContext` in `app/[locale]/_components/game-context.tsx`)
- Manages: selected words, cleared categories, mistakes remaining, win/loss state
- Game progress persisted to localStorage keyed by a hash of the game's categories

### Review Workflow

- Connections in REVIEW state are playable at `app/[locale]/review/`
- Players submit feedback via the `/api/review` endpoint (name ≤50 chars, comment ≤1000 chars, difficulty 1-5, guess history ≤8 guesses)
- Admin can view all reviews and promote/demote connection state

### Key Directories

- `app/[locale]/_components/` — Game UI components (grid, cells, modal, controls)
- `app/[locale]/_hooks/` — Custom hooks (animation)
- `app/[locale]/_types.ts` — Shared TypeScript types
- `app/[locale]/_utils.ts` — Utility functions
- `app/[locale]/admin/` — Admin panel (connections, reviews, login)
- `app/[locale]/review/` — Review submission route
- `app/api/` — API routes (auth, review)
- `i18n/` — next-intl config (`config.ts`, `request.ts`)
- `messages/` — Translation JSON files (`de.json`, `en.json`)
- `lib/` — Shared server utilities (Prisma instance, PostHog, auth)

### Analytics & Monitoring

- PostHog for analytics and error tracking
- PostHog API calls proxied via Next.js rewrites in `next.config.mjs`
- Vercel Analytics and Speed Insights enabled

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss`
- Difficulty level colors: yellow (1), lime (2), blue (3), purple (4)
- Prettier configured via lint-staged with Husky pre-commit hook
