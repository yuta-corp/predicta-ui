# Predicta — Live Traffic Map (design)

Date: 2026-07-02
Status: approved (design), pending spec review

## Goal

A single full-viewport dark vector map of Antananarivo showing live road
congestion, with quartier search to recenter. The map **is** the app — no
scrolling marketing page. Matches `api.yml` exactly: only `/traffic` and
`/quartiers` are consumed.

## Scope

In:
- Full-screen MapLibre GL vector map (dark neon ambiance).
- Live traffic lines from `/traffic`, colored by congestion (`rate`).
- Quartier search (`/quartiers?q=`) that flies the map to the centroid.
- Overlay panels: brand, live stats (avg speed, % congested), legend,
  freshness + manual refresh, zoom controls.
- Server-side proxy so `X-API-Key` never reaches the client.
- Dark-first theme; existing light/dark toggle (`d` key) kept working for UI
  and basemap.

Out (YAGNI — no backing endpoint in `api.yml`):
- Hotspots table, day-of-week heatmap, ticker, hero marketing copy, dev/API
  callout. These live only in the ghost `components/page-shell.tsx`, which is
  deleted. Add when real endpoints exist.

## Decisions

- **Map:** MapLibre GL + OpenFreeMap `liberty`/`dark` style. No API key, free.
- **Ambiance:** dark neon — dark basemap, luminous lime→ink traffic lines,
  glass overlay panels.
- **Search:** `cmdk` `Command` (already installed), debounced.
- **Brand colors:** primary `#9FCA69`, accent-lime `#C1FF72`, ink `#000000`.
- **Wordmark:** CSS/text (no logo asset exists in `public/`).

## Files

New:
| File | Role |
|---|---|
| `app/api/proxy/[...path]/route.ts` | GET proxy → `${NEXT_PUBLIC_API_URL}/<path>` with `X-API-Key` header injected from `API_KEY` env. Only allows `traffic`, `quartiers`. Streams body + `X-Predicta-Partial` header through. |
| `lib/api.ts` | Typed client over `lib/api-schema.ts`: `getTraffic()`, `searchQuartiers(q)`. Calls the proxy, not the backend directly. |
| `components/traffic-map.tsx` | `"use client"`. MapLibre map, GeoJSON source fed from `/traffic`, data-driven line color/width by `rate`. Holds map ref, exposes flyTo for search. Refetch every 30 min + manual. |
| `components/quartier-search.tsx` | `Command` combobox → `searchQuartiers`, debounced ~250ms, flyTo centroid on select. |
| `components/map-overlays.tsx` | Presentational glass panels: `<BrandMark>`, `<LiveStats>`, `<Legend>`, `<Freshness>`. |
| `app/page.tsx` | RSC shell rendering `<TrafficMap>` full-bleed. |

Modified:
- `app/globals.css` — replace generic oklch tokens with brand palette; add
  `--color-lime`, `--color-primary`, `--color-ink`, `--color-graphite` and map
  the semantic tokens (`--primary`, `--accent`, `--ring`) to them for both
  `:root` and `.dark`. Set `<html>` default to dark.
- `app/layout.tsx` — set `lang="fr"`, real `<title>`/metadata, keep
  `ThemeProvider`.

Deleted:
- `components/page-shell.tsx` — ghost scaffolding on dead endpoints.

Dependencies added:
- `maplibre-gl` (map engine). No React wrapper — use it directly via a ref in
  one `useEffect`; a wrapper lib is not worth the dep.

## Data flow

```
browser → /api/proxy/traffic  → (server adds X-API-Key) → localhost:8080/traffic
        ← FeatureCollection (application/geo+json) ────────────────────────────┘
             │
             ├─→ MapLibre GeoJSON source  (line-color = step/interpolate on rate)
             └─→ computeLiveSummary()     → avg speed, % congested  (one pass)

browser → /api/proxy/quartiers?q=…  → … /quartiers?q=…
        ← QuartierView[]  → search list → select → map.flyTo([lon,lat])
```

- `/traffic` returns LineString **and** MultiLineString features. Passed to
  MapLibre unchanged — the `line` layer renders both natively. No coordinate
  massaging.
- `rate` = observed/freeflow (0..~1). Missing `rate` → treated as unknown,
  colored graphite (neutral).
- `X-Predicta-Partial: true` → show a subtle "données partielles" chip; body is
  still valid GeoJSON, render it.

## Congestion → color (data-driven, in-engine)

By `rate`:
| rate | label | color |
|---|---|---|
| ≥ 0.75 | fluide | `#C1FF72` lime |
| 0.5–0.75 | moyen | `#9FCA69` primary |
| 0.25–0.5 | lent | `#5B6650` graphite |
| < 0.25 | bloqué | `#0A0A0A` ink |
| missing | inconnu | graphite, thinner |

Line width interpolates with zoom (thicker when zoomed in). Congested lines get
a faint blur/glow via a second wider translucent layer underneath for the neon
effect.

## Live stats

`computeLiveSummary(features)` → `{ avgSpeed, pctCongested, total }`:
- `avgSpeed`: mean of defined `speed`.
- `pctCongested`: share of features with `rate < 0.5`.
- `total`: feature count.
Rendered in the top-left glass panel with a live dot.

## Error / edge handling

- Proxy path not in allowlist → 404.
- Backend 401 (bad/missing key) → proxy returns 502 with a JSON error; map shows
  a "service indisponible" toast (sonner, installed), map stays on basemap.
- `/traffic` network fail → keep last-good lines if any, show stale badge.
- Empty quartier results → "aucun quartier" in the command list.
- MapLibre requires a browser → component is `"use client"`, dynamically
  imported with `ssr: false` so it never runs on the server.

## Theme

- Default dark (`<html class="dark">` via next-themes `defaultTheme="dark"`).
- Toggle (`d` key) still flips UI panels and swaps MapLibre style
  (dark ⇄ light basemap) via `map.setStyle`.
- Traffic line colors are identical in both themes (brand-driven, readable on
  both).

## Testing

- `test_congestion_color.ts` — assert the rate→bucket mapping (the one piece of
  non-trivial logic): boundaries 0.75, 0.5, 0.25, and missing. Plain `assert`,
  no framework.
- Manual: `pnpm dev`, verify lines render, colors match legend, search flies to
  Analakely, `d` toggles theme, refresh re-fetches. `pnpm lint && pnpm typecheck`.

## Build order

1. Brand tokens in `globals.css` + layout metadata.
2. Proxy route + `lib/api.ts` (+ color test).
3. `traffic-map.tsx` (basemap → traffic source → colors → glow).
4. `map-overlays.tsx` (legend, stats, freshness).
5. `quartier-search.tsx` (search → flyTo).
6. Delete ghost file, wire `app/page.tsx`, lint/typecheck.
