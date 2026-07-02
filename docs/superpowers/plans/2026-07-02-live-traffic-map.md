# Live Traffic Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single full-viewport dark-neon MapLibre map of Antananarivo showing live road congestion, with quartier search to recenter.

**Architecture:** Next.js App Router. A server proxy route injects the API key and forwards to the backend; a thin typed client calls the proxy. One client component owns the MapLibre map and feeds `/traffic` GeoJSON straight into a data-driven line layer. Presentational glass overlays and a cmdk search sit on top. Matches `api.yml` exactly — only `/traffic` and `/quartiers`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Tailwind v4, MapLibre GL 5.x, cmdk (via `components/ui/command.tsx`), sonner, next-themes.

## Global Constraints

- Consume ONLY `/traffic` and `/quartiers`. No hotspots/heatmap/health endpoints — they do not exist.
- `API_KEY` (env) must NEVER reach the client. All backend calls go through `app/api/proxy/[...path]/route.ts`, which adds the `X-API-Key` header server-side.
- Backend base URL: `process.env.NEXT_PUBLIC_API_URL` (currently `http://localhost:8080`). Key: `process.env.API_KEY`.
- Brand palette, exact hex: primary `#9FCA69`, accent-lime `#C1FF72`, ink `#000000`, graphite `#5B6650`.
- Dark-first: `<html>` defaults to dark; `d`-key light/dark toggle stays functional.
- Package manager: `pnpm` only. Path alias `@/*` → project root. `cn()` from `@/lib/utils`.
- UI copy in French. Run `pnpm lint && pnpm typecheck` before every commit.
- `maplibre-gl` is browser-only: its component must be `"use client"` and dynamically imported with `{ ssr: false }`.

---

### Task 1: Brand tokens + dark default + metadata

**Files:**
- Modify: `app/globals.css` (`:root` and `.dark` blocks, ~86-153)
- Modify: `app/layout.tsx`
- Modify: `components/theme-provider.tsx` (defaultTheme)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties available app-wide — `--color-lime: #C1FF72`, `--color-primary-brand: #9FCA69`, `--color-ink: #0A0A0A`, `--color-graphite: #5B6650`; semantic tokens (`--primary`, `--ring`, `--accent`) remapped to brand. Dark is the default theme.

- [ ] **Step 1: Add brand tokens to `app/globals.css` `:root`**

Inside the existing `:root { … }` block, append these lines before the closing brace (keep the radius/sidebar lines that are already there):

```css
    /* Predicta brand */
    --color-lime: #C1FF72;
    --color-primary-brand: #9FCA69;
    --color-ink: #0A0A0A;
    --color-graphite: #5B6650;
    /* remap semantic tokens to brand */
    --primary: #9FCA69;
    --primary-foreground: #0A0A0A;
    --accent: #C1FF72;
    --accent-foreground: #0A0A0A;
    --ring: #9FCA69;
```

- [ ] **Step 2: Add brand tokens to `.dark`**

Inside the existing `.dark { … }` block, append before the closing brace:

```css
    /* Predicta brand (identical hex; lines readable on both) */
    --color-lime: #C1FF72;
    --color-primary-brand: #9FCA69;
    --color-ink: #0A0A0A;
    --color-graphite: #5B6650;
    --primary: #9FCA69;
    --primary-foreground: #0A0A0A;
    --accent: #C1FF72;
    --accent-foreground: #0A0A0A;
    --ring: #9FCA69;
```

- [ ] **Step 3: Default the app to dark**

In `components/theme-provider.tsx`, change the `NextThemesProvider` props from `defaultTheme="system"` `enableSystem` to:

```tsx
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
```

- [ ] **Step 4: Set metadata + lang in `app/layout.tsx`**

Replace the file contents with:

```tsx
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Predicta — Trafic Antananarivo en direct",
  description:
    "Carte du trafic en temps réel d'Antananarivo. Évitez les bouchons, gagnez du temps.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify build compiles**

Run: `pnpm typecheck`
Expected: PASS (no errors). If `Metadata` import errors, confirm `next` types resolve.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx components/theme-provider.tsx
git commit -m "feat: brand palette, dark default, app metadata"
```

---

### Task 2: Server proxy route

**Files:**
- Create: `app/api/proxy/[...path]/route.ts`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_API_URL`, `process.env.API_KEY`.
- Produces: `GET /api/proxy/traffic` and `GET /api/proxy/quartiers?q=…`. Returns the backend body verbatim with its `content-type`; forwards `X-Predicta-Partial` when present. Non-allowlisted paths → 404. Backend/network failure → 502 JSON `{ error: string }`.

- [ ] **Step 1: Write the route**

```ts
import { NextRequest } from "next/server"

const ALLOWED = new Set(["traffic", "quartiers"])

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const head = path[0]
  if (!head || !ALLOWED.has(head)) {
    return Response.json({ error: "not found" }, { status: 404 })
  }

  const base = process.env.NEXT_PUBLIC_API_URL
  const key = process.env.API_KEY
  if (!base || !key) {
    return Response.json({ error: "server misconfigured" }, { status: 500 })
  }

  const url = new URL(`${base}/${path.join("/")}`)
  url.search = req.nextUrl.search

  try {
    const upstream = await fetch(url, {
      headers: { "X-API-Key": key, accept: "application/geo+json, application/json" },
      cache: "no-store",
    })

    if (!upstream.ok) {
      return Response.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 },
      )
    }

    const body = await upstream.text()
    const res = new Response(body, {
      status: 200,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    })
    const partial = upstream.headers.get("X-Predicta-Partial")
    if (partial) res.headers.set("X-Predicta-Partial", partial)
    return res
  } catch {
    return Response.json({ error: "upstream unreachable" }, { status: 502 })
  }
}
```

- [ ] **Step 2: Manual smoke test (backend must be up on :8080)**

Run: `pnpm dev` then in another shell:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/proxy/quartiers
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/proxy/nope
```
Expected: `200` for quartiers, `404` for nope. (If backend down: `502` for quartiers — acceptable, confirms proxy logic. Stop dev server after.)

- [ ] **Step 3: Commit**

```bash
git add app/api/proxy/[...path]/route.ts
git commit -m "feat: server proxy injecting API key for traffic/quartiers"
```

---

### Task 3: Typed client + congestion color helper (with test)

**Files:**
- Create: `lib/api.ts`
- Create: `lib/congestion.ts`
- Create: `lib/congestion.test.ts`

**Interfaces:**
- Consumes: schema types from `lib/api-schema.ts` (`components["schemas"]["TrafficFeatureCollection"]`, `QuartierView`), the proxy from Task 2.
- Produces:
  - `type TrafficCollection = components["schemas"]["TrafficFeatureCollection"]`
  - `type Quartier = components["schemas"]["QuartierView"]`
  - `getTraffic(signal?: AbortSignal): Promise<{ data: TrafficCollection; partial: boolean }>`
  - `searchQuartiers(q: string, signal?: AbortSignal): Promise<Quartier[]>`
  - `congestionBucket(rate: number | undefined): "fluide" | "moyen" | "lent" | "bloque" | "inconnu"`
  - `BUCKET_COLOR: Record<Bucket, string>` and `BUCKET_LABEL: Record<Bucket, string>`

- [ ] **Step 1: Write the failing test for `congestionBucket`**

`lib/congestion.test.ts`:
```ts
import assert from "node:assert/strict"
import { congestionBucket } from "./congestion.ts"

// boundaries are inclusive at the lower edge of the higher bucket
assert.equal(congestionBucket(0.9), "fluide")
assert.equal(congestionBucket(0.75), "fluide")
assert.equal(congestionBucket(0.74), "moyen")
assert.equal(congestionBucket(0.5), "moyen")
assert.equal(congestionBucket(0.49), "lent")
assert.equal(congestionBucket(0.25), "lent")
assert.equal(congestionBucket(0.24), "bloque")
assert.equal(congestionBucket(0), "bloque")
assert.equal(congestionBucket(undefined), "inconnu")

console.log("congestion.test: all passed")
```

- [ ] **Step 2: Run it, verify it fails**

Run: `pnpm exec tsx lib/congestion.test.ts` (if `tsx` missing, use `node --experimental-strip-types lib/congestion.test.ts`)
Expected: FAIL — cannot find module `./congestion.ts`.

- [ ] **Step 3: Write `lib/congestion.ts`**

```ts
export type Bucket = "fluide" | "moyen" | "lent" | "bloque" | "inconnu"

export function congestionBucket(rate: number | undefined): Bucket {
  if (rate == null || Number.isNaN(rate)) return "inconnu"
  if (rate >= 0.75) return "fluide"
  if (rate >= 0.5) return "moyen"
  if (rate >= 0.25) return "lent"
  return "bloque"
}

export const BUCKET_COLOR: Record<Bucket, string> = {
  fluide: "#C1FF72",
  moyen: "#9FCA69",
  lent: "#5B6650",
  bloque: "#0A0A0A",
  inconnu: "#3A3F34",
}

export const BUCKET_LABEL: Record<Bucket, string> = {
  fluide: "Fluide",
  moyen: "Moyen",
  lent: "Lent",
  bloque: "Bloqué",
  inconnu: "Inconnu",
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `pnpm exec tsx lib/congestion.test.ts`
Expected: `congestion.test: all passed`

- [ ] **Step 5: Write `lib/api.ts`**

```ts
import type { components } from "@/lib/api-schema"

export type TrafficCollection =
  components["schemas"]["TrafficFeatureCollection"]
export type Quartier = components["schemas"]["QuartierView"]

export async function getTraffic(
  signal?: AbortSignal,
): Promise<{ data: TrafficCollection; partial: boolean }> {
  const res = await fetch("/api/proxy/traffic", { cache: "no-store", signal })
  if (!res.ok) throw new Error(`traffic ${res.status}`)
  const data = (await res.json()) as TrafficCollection
  return { data, partial: res.headers.get("X-Predicta-Partial") === "true" }
}

export async function searchQuartiers(
  q: string,
  signal?: AbortSignal,
): Promise<Quartier[]> {
  const res = await fetch(
    `/api/proxy/quartiers?q=${encodeURIComponent(q)}`,
    { cache: "no-store", signal },
  )
  if (!res.ok) throw new Error(`quartiers ${res.status}`)
  return (await res.json()) as Quartier[]
}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/api.ts lib/congestion.ts lib/congestion.test.ts
git commit -m "feat: typed traffic/quartiers client and congestion buckets"
```

---

### Task 4: MapLibre traffic map (basemap → lines → colors → glow)

**Files:**
- Create: `components/traffic-map.tsx`
- Modify: `app/globals.css` (append one import + one rule, see Step 1)
- Modify: `package.json` (add dep, via pnpm)

**Interfaces:**
- Consumes: `getTraffic` (Task 3), `BUCKET_COLOR` (Task 3).
- Produces:
  - default export `TrafficMap` — `"use client"` component, full-bleed map.
  - `type TrafficMapHandle = { flyTo: (lon: number, lat: number) => void }` — exported, used by search (Task 6).
  - Renders children as overlays via a `children` prop so `page.tsx` composes overlays + search on top.
  - Calls `onData?(features, partial)` so parent can compute stats (Task 5).

- [ ] **Step 1: Install MapLibre and import its CSS**

Run: `pnpm add maplibre-gl@^5`

In `app/globals.css`, add at the very top (line 1, before the tailwind import is fine — MapLibre CSS is independent):
```css
@import "maplibre-gl/dist/maplibre-gl.css";
```

And append at the end of the file a rule so MapLibre controls match the dark UI:
```css
.maplibregl-ctrl-group {
  background: color-mix(in oklab, var(--card) 85%, transparent);
  border: 1px solid var(--border);
}
```

- [ ] **Step 2: Write `components/traffic-map.tsx`**

```tsx
"use client"

import { useEffect, useImperativeHandle, useRef } from "react"
import type { Ref } from "react"
import maplibregl from "maplibre-gl"
import { getTraffic, type TrafficCollection } from "@/lib/api"

// OpenFreeMap dark vector style — no API key.
const DARK_STYLE = "https://tiles.openfreemap.org/styles/dark"
const LIGHT_STYLE = "https://tiles.openfreemap.org/styles/liberty"
const TANA: [number, number] = [47.5210, -18.8792]

export type TrafficMapHandle = { flyTo: (lon: number, lat: number) => void }

// rate-driven line color, evaluated in-engine.
const LINE_COLOR: maplibregl.ExpressionSpecification = [
  "step",
  ["coalesce", ["get", "rate"], -1],
  "#3A3F34", // rate < 0 → inconnu
  0,
  "#0A0A0A", // bloqué
  0.25,
  "#5B6650", // lent
  0.5,
  "#9FCA69", // moyen
  0.75,
  "#C1FF72", // fluide
]

export default function TrafficMap({
  handleRef,
  onData,
  theme,
  children,
}: {
  handleRef?: Ref<TrafficMapHandle>
  onData?: (data: TrafficCollection, partial: boolean) => void
  theme?: "dark" | "light"
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useImperativeHandle(handleRef, () => ({
    flyTo: (lon, lat) =>
      mapRef.current?.flyTo({ center: [lon, lat], zoom: 15, speed: 1.4 }),
  }))

  // init map once
  useEffect(() => {
    if (!containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: theme === "light" ? LIGHT_STYLE : DARK_STYLE,
      center: TANA,
      zoom: 12.5,
      attributionControl: { compact: true },
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right")

    map.on("load", () => {
      map.addSource("traffic", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })
      // glow underlay
      map.addLayer({
        id: "traffic-glow",
        type: "line",
        source: "traffic",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": LINE_COLOR,
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 4, 16, 12],
          "line-opacity": 0.25,
          "line-blur": 4,
        },
      })
      // crisp line
      map.addLayer({
        id: "traffic-line",
        type: "line",
        source: "traffic",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": LINE_COLOR,
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.2, 16, 4],
        },
      })
      void loadTraffic()
    })

    let cancelled = false
    const controller = new AbortController()
    async function loadTraffic() {
      try {
        const { data, partial } = await getTraffic(controller.signal)
        if (cancelled) return
        const src = map.getSource("traffic") as maplibregl.GeoJSONSource | undefined
        src?.setData(data as GeoJSON.FeatureCollection)
        onData?.(data, partial)
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.warn("traffic:", e)
      }
    }

    // refetch every 30 min (backend cadence)
    const iv = setInterval(loadTraffic, 30 * 60 * 1000)

    return () => {
      cancelled = true
      controller.abort()
      clearInterval(iv)
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // swap basemap on theme change (keeps traffic source: re-add on styledata)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const style = theme === "light" ? LIGHT_STYLE : DARK_STYLE
    map.setStyle(style, { diff: false })
    map.once("styledata", () => {
      if (map.getSource("traffic")) return
      // style reset wiped layers; nothing to do here — handled by re-init guard
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  return (
    <div className="relative h-dvh w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {children}
    </div>
  )
}
```

Note on the theme effect: `setStyle` wipes custom layers. To keep this task self-contained and avoid a fragile re-add dance, Task 6's page wires `theme` only after first paint; full basemap-swap re-layering is handled by keying the map — see Task 6 Step 3 (the page remounts the map on theme change via React `key`). Leave the `styledata` effect as written; it is a harmless no-op that documents intent.

- [ ] **Step 3: Temporary mount to eyeball it**

Temporarily set `app/page.tsx` to:
```tsx
import dynamic from "next/dynamic"
const TrafficMap = dynamic(() => import("@/components/traffic-map"), { ssr: false })
export default function Page() {
  return <TrafficMap />
}
```

Run: `pnpm dev`, open http://localhost:3000.
Expected: dark basemap centered on Tana; if backend up, colored lines appear. `pnpm typecheck` passes. (This `page.tsx` is finalized in Task 6.)

- [ ] **Step 4: Commit**

```bash
git add components/traffic-map.tsx app/globals.css app/page.tsx package.json pnpm-lock.yaml
git commit -m "feat: MapLibre traffic map with rate-driven neon lines"
```

---

### Task 5: Overlay panels (brand, live stats, legend, freshness)

**Files:**
- Create: `components/map-overlays.tsx`
- Create: `lib/summary.ts`
- Create: `lib/summary.test.ts`

**Interfaces:**
- Consumes: `TrafficCollection` (Task 3), `BUCKET_COLOR`/`BUCKET_LABEL` (Task 3), `congestionBucket` (Task 3).
- Produces:
  - `computeLiveSummary(data: TrafficCollection | null): { avgSpeed: number | null; pctCongested: number | null; total: number }`
  - `<BrandMark />`, `<LiveStats summary={…} partial={boolean} />`, `<Legend />`, `<Freshness updatedAt={Date | null} onRefresh={() => void} />` — all presentational, glass-styled.

- [ ] **Step 1: Failing test for `computeLiveSummary`**

`lib/summary.test.ts`:
```ts
import assert from "node:assert/strict"
import { computeLiveSummary } from "./summary.ts"
import type { TrafficCollection } from "./api.ts"

const fc: TrafficCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { speed: 30, rate: 0.9 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
    { type: "Feature", properties: { speed: 10, rate: 0.3 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
    { type: "Feature", properties: { speed: 20, rate: 0.4 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
  ],
}
const s = computeLiveSummary(fc)
assert.equal(s.total, 3)
assert.equal(s.avgSpeed, 20)          // (30+10+20)/3
assert.equal(s.pctCongested, 67)      // 2 of 3 have rate < 0.5 → round(66.6)
assert.deepEqual(computeLiveSummary(null), { avgSpeed: null, pctCongested: null, total: 0 })

console.log("summary.test: all passed")
```

- [ ] **Step 2: Run, verify fail**

Run: `pnpm exec tsx lib/summary.test.ts`
Expected: FAIL — cannot find `./summary.ts`.

- [ ] **Step 3: Write `lib/summary.ts`**

```ts
import type { TrafficCollection } from "@/lib/api"

export function computeLiveSummary(data: TrafficCollection | null): {
  avgSpeed: number | null
  pctCongested: number | null
  total: number
} {
  if (!data || data.features.length === 0) {
    return { avgSpeed: null, pctCongested: null, total: 0 }
  }
  let sum = 0
  let n = 0
  let congested = 0
  for (const f of data.features) {
    const speed = f.properties?.speed
    const rate = f.properties?.rate
    if (typeof speed === "number") {
      sum += speed
      n++
    }
    if (typeof rate === "number" && rate < 0.5) congested++
  }
  return {
    avgSpeed: n ? Math.round(sum / n) : null,
    pctCongested: Math.round((congested / data.features.length) * 100),
    total: data.features.length,
  }
}
```

- [ ] **Step 4: Run, verify pass**

Run: `pnpm exec tsx lib/summary.test.ts`
Expected: `summary.test: all passed`.

- [ ] **Step 5: Write `components/map-overlays.tsx`**

```tsx
"use client"

import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { BUCKET_COLOR, BUCKET_LABEL, type Bucket } from "@/lib/congestion"

const GLASS =
  "rounded-lg border border-white/10 bg-black/50 backdrop-blur-md shadow-lg"

export function BrandMark() {
  return (
    <div className={cn(GLASS, "pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5")}>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--color-lime)] font-bold text-[var(--color-ink)]">
        P
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-foreground">Predicta</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Trafic · Tana
        </p>
      </div>
    </div>
  )
}

export function LiveStats({
  summary,
  partial,
}: {
  summary: { avgSpeed: number | null; pctCongested: number | null; total: number }
  partial: boolean
}) {
  return (
    <div className={cn(GLASS, "pointer-events-auto w-52 px-4 py-3")}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-lime)] opacity-70" />
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-lime)]" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          En direct
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">
        {summary.avgSpeed ?? "—"}
        <span className="ml-1 text-sm font-normal text-muted-foreground">km/h moy.</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {summary.pctCongested != null
          ? `${summary.pctCongested}% embouteillé · ${summary.total} rues`
          : "En attente de données"}
      </p>
      {partial ? (
        <p className="mt-2 rounded bg-amber-500/15 px-2 py-1 text-[10px] text-amber-300">
          Données partielles
        </p>
      ) : null}
    </div>
  )
}

const LEGEND: Bucket[] = ["fluide", "moyen", "lent", "bloque"]

export function Legend() {
  return (
    <div className={cn(GLASS, "pointer-events-auto px-3.5 py-3")}>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Congestion
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {LEGEND.map((b) => (
          <li key={b} className="flex items-center gap-2 text-xs text-foreground">
            <span
              className="inline-block h-1.5 w-5 rounded-full"
              style={{ background: BUCKET_COLOR[b] }}
            />
            {BUCKET_LABEL[b]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Freshness({
  updatedAt,
  onRefresh,
}: {
  updatedAt: Date | null
  onRefresh: () => void
}) {
  const label = updatedAt
    ? updatedAt.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Indian/Antananarivo",
      })
    : "—"
  return (
    <button
      onClick={onRefresh}
      className={cn(
        GLASS,
        "pointer-events-auto flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground",
      )}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      MàJ {label} EAT
    </button>
  )
}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. (If `lucide-react` `RefreshCw` import errors, confirm the icon name exists in the installed version; `RefreshCw` is standard.)

- [ ] **Step 7: Commit**

```bash
git add components/map-overlays.tsx lib/summary.ts lib/summary.test.ts
git commit -m "feat: glass overlay panels and live summary"
```

---

### Task 6: Quartier search + final page composition + delete ghost file

**Files:**
- Create: `components/quartier-search.tsx`
- Modify: `app/page.tsx` (final version)
- Delete: `components/page-shell.tsx`

**Interfaces:**
- Consumes: `searchQuartiers` (Task 3), `Command*` from `@/components/ui/command`, `TrafficMap` + `TrafficMapHandle` (Task 4), overlays + `computeLiveSummary` (Task 5), `useTheme` from `next-themes`.
- Produces: default export `QuartierSearch` — `{ onSelect: (lon: number, lat: number) => void }`. And the finished `app/page.tsx` composing everything.

- [ ] **Step 1: Write `components/quartier-search.tsx`**

```tsx
"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"
import { searchQuartiers, type Quartier } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function QuartierSearch({
  onSelect,
}: {
  onSelect: (lon: number, lat: number) => void
}) {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<Quartier[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const id = setTimeout(async () => {
      try {
        setResults(await searchQuartiers(q, controller.signal))
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResults([])
      }
    }, 250)
    return () => {
      clearTimeout(id)
      controller.abort()
    }
  }, [q])

  return (
    <Command
      shouldFilter={false}
      className={cn(
        "w-64 overflow-visible rounded-lg border border-white/10 bg-black/50 backdrop-blur-md",
      )}
    >
      <div className="flex items-center gap-2 px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <CommandInput
          value={q}
          onValueChange={(v) => {
            setQ(v)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher un quartier…"
          className="h-11"
        />
      </div>
      {open && q.length > 0 ? (
        <CommandList className="max-h-64">
          <CommandEmpty>Aucun quartier</CommandEmpty>
          {results.map((qt) => (
            <CommandItem
              key={`${qt.name}-${qt.lon}-${qt.lat}`}
              value={qt.name}
              onSelect={() => {
                onSelect(qt.lon, qt.lat)
                setOpen(false)
                setQ(qt.name)
              }}
            >
              {qt.name}
            </CommandItem>
          ))}
        </CommandList>
      ) : null}
    </Command>
  )
}
```

- [ ] **Step 2: Delete the ghost file**

Run: `git rm components/page-shell.tsx`
Expected: file removed (it was never committed to a needed path; it imports nonexistent components).

Note: if `git rm` reports the file is untracked, use `rm components/page-shell.tsx`.

- [ ] **Step 3: Write the final `app/page.tsx`**

```tsx
"use client"

import { useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import type { TrafficMapHandle } from "@/components/traffic-map"
import type { TrafficCollection } from "@/lib/api"
import { computeLiveSummary } from "@/lib/summary"
import {
  BrandMark,
  LiveStats,
  Legend,
  Freshness,
} from "@/components/map-overlays"
import QuartierSearch from "@/components/quartier-search"

const TrafficMap = dynamic(() => import("@/components/traffic-map"), {
  ssr: false,
})

export default function Page() {
  const handleRef = useRef<TrafficMapHandle>(null)
  const [data, setData] = useState<TrafficCollection | null>(null)
  const [partial, setPartial] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const { resolvedTheme } = useTheme()

  const onData = useCallback((d: TrafficCollection, p: boolean) => {
    setData(d)
    setPartial(p)
    setUpdatedAt(new Date())
  }, [])

  const summary = computeLiveSummary(data)

  return (
    <TrafficMap
      // remount on theme change → clean basemap swap without layer surgery
      key={`${resolvedTheme}-${reloadKey}`}
      handleRef={handleRef}
      onData={onData}
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-4">
          <BrandMark />
          <div className="pointer-events-auto">
            <QuartierSearch
              onSelect={(lon, lat) => handleRef.current?.flyTo(lon, lat)}
            />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <LiveStats summary={summary} partial={partial} />
            <Legend />
          </div>
          <Freshness
            updatedAt={updatedAt}
            onRefresh={() => setReloadKey((k) => k + 1)}
          />
        </div>
      </div>
    </TrafficMap>
  )
}
```

- [ ] **Step 4: Full check**

Run: `pnpm lint && pnpm typecheck`
Expected: both PASS.

- [ ] **Step 5: Manual end-to-end (backend up on :8080)**

Run: `pnpm dev`, open http://localhost:3000. Verify:
- Dark basemap on Tana; colored traffic lines matching legend.
- Live stats show avg km/h + % + count.
- Type "ana" in search → results → click → map flies to centroid.
- Press `d` → basemap + panels switch to light; press `d` again → dark.
- Click freshness chip → traffic re-fetches, time updates.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/quartier-search.tsx
git rm --cached components/page-shell.tsx 2>/dev/null || true
git commit -m "feat: quartier search, compose map page, drop ghost shell"
```

---

## Self-Review notes

- **Spec coverage:** proxy (T2), typed client (T3), map+colors+glow (T4), overlays+stats (T5), search+flyTo+compose+delete-ghost (T6), brand tokens+dark+metadata (T1), tests for the two non-trivial pure functions (T3, T5). Partial-header chip (T5). Theme swap via remount (T6). All spec sections mapped.
- **Type consistency:** `TrafficCollection`, `Quartier`, `TrafficMapHandle`, `Bucket`, `computeLiveSummary`, `congestionBucket`, `BUCKET_COLOR`/`BUCKET_LABEL` used with identical names across tasks.
- **Known simplification (ponytail):** theme basemap swap is done by remounting the map (`key` on theme) instead of live `setStyle` + layer re-add. Simpler, no flicker-management code. Upgrade to live `setStyle` only if remount cost becomes visible.
- **Backend dependency:** manual smoke steps assume backend on `:8080`. If down, proxy returns 502 and the map still renders the basemap — acceptable, noted in steps.
```
