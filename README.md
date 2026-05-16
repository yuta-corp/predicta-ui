# Predicta UI

Dashboard UI for Antananarivo traffic congestion. Built with Next.js 16, React 19, shadcn/ui, Tailwind CSS v4.

**API:** `https://predicta-api.railway.app/` (see `docs/openapi.yml`)

## Dev

```bash
pnpm dev        # http://localhost:3000
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm format     # Prettier
pnpm build      # Production build
```

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript 5.9
- Tailwind CSS v4, shadcn/ui (radix-nova)
- next-themes (press `d` for dark mode)
- pnpm only

## Repos

- **predicta-api** (`~/yuta_corp/predicta-api`) — backend
- **scrap** (`~/scrap`) — data analysis
