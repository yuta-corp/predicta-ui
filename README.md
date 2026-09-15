<div align="center">

<img src="public/logo.svg" alt="Predicta" width="160" height="160" style="border-radius: 24px;" />

<br/>

# Predicta

### See traffic before you leave.

<br/>

**Real-time road-traffic map for Antananarivo, Madagascar.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Clerk](https://img.shields.io/badge/Clerk-7-6c47ff?style=for-the-badge&logo=clerk&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=for-the-badge&logo=prisma&logoColor=white) ![MapLibre](https://img.shields.io/badge/MapLibre%20GL-6-396cb2?style=for-the-badge&logo=maplibre&logoColor=white) ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

![Predicta](public/og.png)

<br/>

</div>

---

**Predicta** shows you the congestion on every street of Antananarivo — before you head out. No more guessing if Analakely is gridlocked or if the route through Isoraka is clear. Open the map, see the colors, decide.

The app is built around two ideas:

> **See everything.** Every street, every quartier, every moment — color-coded by congestion in real time.
>
> **Share safely.** Let friends see where you are, only when you choose to, or send a secret link that expires in 24 hours.

---

## Features

### The Map

The heart of Predicta. Every street in Antananarivo is rendered on an interactive map with live congestion data.

- **Click any street** to see its name, quartier, speed, and congestion level
- **Search quartiers** (⌘K) and fly to any of the 372 quartiers
- **3D view** with camera tilt and building visualization
- **Light & dark modes** — your preference, always remembered
- Freshness indicator: always know how recent the data is

### Friends

Find your people on the map.

- Send friend requests with a unique pseudonym (3–20 characters)
- Accept, decline, or remove — you're always in control
- Accounts sync automatically with your login

### Live Location Sharing

Share where you are, with exactly who you want.

- **Explicit authorization**: only friends you approve can see you
- **Secret links**: share via a 24-hour token — no account needed on the other end
- **Always opt-in**: location sharing only starts when you say so, and stops when you want
- Positions update every 30 seconds; stale data (5+ minutes) is automatically ignored

### Notifications

Stay in the loop, even when you're not looking.

- **In-app alerts**: friend requests, acceptances, and location-share starts via a live event stream
- **Web Push**: native notifications on your device, even when the app is closed

### And More

- **Animated landing page** that tells the story of Predicta
- **Status page** showing live API health
- **Legal pages**: mentions légales, CGU, CGV, privacy policy, cookies with category-based consent
- **Full SEO**: Open Graph, Twitter Cards, sitemap, robots.txt

---

## Privacy First

- **Traffic data is never stored** — it's shown live, then discarded
- **Location is always opt-in** — you decide who sees you, and stopping sharing deletes your position
- **Sharing is per-friend** — no broadcast, no public map of people
- **Secret links expire after 24 h** — nothing stays linkable forever

---

## Quick Start

```bash
git clone git@github.com:yuta-corp/predicta-ui.git
cd predicta-ui
pnpm install
cp .env.example .env     # fill in your keys
pnpm db:migrate
pnpm dev                 # → http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, **TypeScript 5**, **Tailwind CSS 4**, **shadcn/ui** |
| Map | **MapLibre GL 6** with vector tiles |
| Auth | **Clerk 7** (middleware, webhooks, server actions) |
| Database | **Prisma 7** + **PostgreSQL** (Neon, Supabase, RDS…) |
| State | **Zustand** for global stores |
| Push | **Web Push** with VAPID keys |
| Deploy | **Vercel** |

---

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server with Turbopack |
| `pnpm build` | Production build (runs migrations first) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript type-checking |
| `pnpm test` | Vitest unit tests |
| `pnpm format` | Prettier formatting |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Create a dev migration |
| `pnpm db:deploy` | Apply pending migrations |

---

## Project Structure

```
app/
  (city)/                    Map + quartier index
  api/predicta/*             Server proxy to the Predicta API
  api/notifications          Live event stream (SSE)
  api/webhooks/clerk         Clerk → user sync
  friends, share, status     Social & status pages
components/
  map/                       MapLibre layers, search, controls
  friends/                   Friend management UI
  location-sharing/          Sharing controls & panels
  shell/                     Layouts & navigation
  ui/                        shadcn/ui primitives
lib/
  traffic/                   Traffic engine & freshness
  map/                       Map runtime & layers
  notifications/             SSE, events
  push/                      VAPID, subscriptions
  actions/                   Server actions
  store/                     Zustand stores
prisma/schema.prisma         Data model
proxy.ts                     Clerk middleware (Next 16+)
```

---

## Git Workflow

All commits are written in **English** and follow [Conventional Commits](https://www.conventionalcommits.org).

```
<type>(<scope>): <subject>
```

| Type | When |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change, no behavior change |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Tooling, dependencies |
| `style` | Formatting, no logic change |

**Rules:**
- Subject in English, imperative mood, lowercase, no period, ≤ 72 chars
- One logical change per commit
- UI text stays in French (`fr_MG`), but code & commits are English
- Branch naming: `feat/<name>`, `fix/<name>`, `hotfix/<name>`

```
feat(map): add 3D buildings toggle
fix(location): ignore stale shared positions
docs(readme): rewrite in English
```

---

## Contributing

1. Create a branch from `main`
2. Make your changes
3. Run `pnpm lint && pnpm typecheck && pnpm test`
4. Open a PR targeting `main`
5. Use a conventional commit title in English

---

<div align="center">

**[predicta.mg](https://predicta.mg)** · Built for Antananarivo

</div>