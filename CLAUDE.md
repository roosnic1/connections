# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NYT Connections clone built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS v4. The game presents a 4x4 grid of words where players find four groups of four related words.

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

### Routing & i18n

- Locale-based routing via `app/[locale]/` with next-intl proxy (formerly middleware)
- Supported languages: German (de, default), English (en)
- Locale prefix strategy: `as-needed` (default locale omitted from URL)
- Translations managed via Tolgee with fallback JSON files in `messages/`
- Language constants defined in `tolgee/shared.ts` (`ALL_LANGUAGES`, `DEFAULT_LANGUAGE`)

### Data Layer

- PostgreSQL via Prisma ORM 7 with Prisma Accelerate for serverless
- Schema: `Connection` → `Category[]` (4 per game) → `words: String[]` (4 per category)
- Each category has a `level` (1-4) representing difficulty
- Prisma client generated to `prisma/generated/prisma/` (configured in `prisma/schema.prisma`)
- Prisma config (datasource URL, seed) in `prisma.config.ts` (loads `.env.local` via dotenv)
- Prisma singleton in `lib/prisma.ts`
- Data fetched server-side in `app/[locale]/page.tsx`

### Game State Management

- React Context (`GameContext` in `app/[locale]/_components/game-context.tsx`)
- Manages: selected words, cleared categories, mistakes remaining, win/loss state
- Game progress persisted to localStorage keyed by a hash of the game's categories
- No API routes — all data fetching happens server-side via Prisma

### Key Directories

- `app/[locale]/_components/` — Game UI components (grid, cells, modal, controls)
- `app/[locale]/_hooks/` — Custom hooks (animation)
- `app/[locale]/_types.ts` — Shared TypeScript types
- `app/[locale]/_utils.ts` — Utility functions
- `tolgee/` — Translation setup (client.tsx, server.tsx, shared.ts)
- `lib/` — Shared server utilities (Prisma instance, PostHog)

### Analytics & Monitoring

- PostHog for analytics and error tracking (replaced Sentry)
- PostHog API calls proxied via Next.js rewrites in `next.config.mjs`
- Vercel Analytics and Speed Insights enabled

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss`
- Difficulty level colors: yellow (1), lime (2), blue (3), purple (4)
- Prettier configured via lint-staged with Husky pre-commit hook
