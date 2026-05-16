# Predicta UI — agent guide

## Project

Next.js 16 dashboard for Antananarivo traffic congestion.  
**API:** `https://predicta-api.railway.app/` (key in `API_KEY` env var, see `.env`)  
**API spec:** `docs/openapi.yml` (endpoints: `/traffic`, `/hotspots`, `/heatmap`, `/health`)  
**Sister repos:** `~/yuta_corp/predicta-api` (backend), `~/scrap` (data analysis)

## Commands

| Action | Command |
|---|---|
| Dev server | `pnpm dev` (Turbopack, http://localhost:3000) |
| Build | `pnpm build` |
| Lint | `pnpm lint` (ESLint 9 flat config) |
| Typecheck | `pnpm typecheck` (tsc --noEmit) |
| Format | `pnpm format` (Prettier via pnpm) |
| Add shadcn/ui component | `pnpm shadcn add button` |

Always run **lint → typecheck** after making changes. No test command exists yet.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack for dev)
- **React 19**, TypeScript 5.9
- **Tailwind CSS v4** (`@import "tailwindcss"` in globals.css, PostCSS plugin `@tailwindcss/postcss`)
- **shadcn/ui** (radix-nova style, lucide icons, `class-variance-authority`, `radix-ui`)
- **next-themes** (dark mode toggle via `d` key)
- **pnpm** only (no npm/yarn lockfiles in repo)

## Conventions

- Path alias `@/*` → project root (e.g. `@/components/ui/button`)
- `cn()` utility in `lib/utils.ts` for class merging
- Components are PascalCase, non‑ui in `components/`, UI primitives in `components/ui/`
- Git: conventional-ish commits, no CI, no hooks
- Format on save preferred (Prettier config in `.prettierrc`, tailwind plugin sorts classes)
