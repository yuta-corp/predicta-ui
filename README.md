# Predicta UI

A real-time traffic map for Antananarivo with authentication, friend system, and location sharing.

## Features

- **Authentication**: Clerk-based authentication (sign up/sign in with email/password or social providers)
- **Friends System**: Send friend requests, accept/reject requests, view friends list, remove friends (`/friends`)
- **Location Sharing**: Opt-in real-time location sharing with friends (updates every 30 seconds when sharing is enabled), friends' positions rendered on the map
- **Real-time Traffic Map**: Live traffic conditions for Antananarivo
- **Quartier Search**: Search by neighborhood to recenter the map

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Clerk** for authentication (`@clerk/nextjs`, middleware via `proxy.ts` — Next 16 convention)
- **Prisma ORM 7** + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- **MapLibre GL** for the map, **shadcn/ui** + Tailwind CSS 4 for the UI

## Setup

### 1. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SIGNING_SECRET=...   # Clerk Dashboard → Webhooks → Signing secret
DATABASE_URL=postgresql://...      # Neon, Supabase, RDS…
```

The existing traffic API variables (`API_URL`, `API_KEY`) are only needed for the traffic data.

### 2. Install and generate the Prisma client

```bash
pnpm install
pnpm db:generate
```

### 3. Apply the database schema

```bash
pnpm db:migrate    # creates + applies migrations (development)
# or, on an existing database:
pnpm db:deploy
```

### 4. Webhook

In the Clerk Dashboard, create a webhook endpoint pointing to
`https://your-app.com/api/webhooks/clerk` with the events:

- `user.created`
- `user.updated`
- `user.deleted`

Use the endpoint's **Signing secret** as `CLERK_WEBHOOK_SIGNING_SECRET`.
The webhook keeps the local `users` table in sync with Clerk (profiles shown
to friends come from this table). Server actions also re-sync a user on demand,
so the webhook is a fast path, not a hard dependency.

### 5. Run

```bash
pnpm dev
```

## Architecture notes

- **Server actions over API routes**: friends and location mutations run as
  server actions (`lib/actions/*`) with `await auth()` from
  `@clerk/nextjs/server` — no fetch plumbing, no tokens on the client.
  The only API routes are the Clerk webhook (external POST) and the existing
  traffic proxy (`/api/predicta/*`).
- **Data model** (`prisma/schema.prisma`): `User` (mirror of Clerk accounts),
  `Friendship` (pending → accepted | declined, unique per pair),
  `LocationShare` (one row per user, upserted every 30 s while sharing).
- **Privacy**: locations are only readable by accepted friends, and positions
  older than 5 minutes are ignored. Sharing is opt-in with an explicit toggle.

## Scripts

| Script             | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Start the dev server                    |
| `pnpm build`       | Production build                        |
| `pnpm lint`        | ESLint                                  |
| `pnpm typecheck`   | TypeScript check (no emit)              |
| `pnpm test`        | Vitest unit tests                       |
| `pnpm db:generate` | Generate the Prisma client              |
| `pnpm db:migrate`  | Create and apply a development migration |
| `pnpm db:deploy`   | Apply pending migrations                |
| `pnpm db:push`     | Push the schema without migrations      |

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
