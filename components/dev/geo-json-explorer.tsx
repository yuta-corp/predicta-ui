"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTraffic } from "@/hooks/use-traffic"
import { Search } from "@/components/map/search"
import { buildJsonDocument, rangeAtLine } from "@/lib/geojson/render"
import { formatRate, formatSpeed } from "@/lib/format"
import { featureKey } from "@/lib/geo"
import { cn } from "@/lib/utils"

type Tab = "geojson" | "features"

export function GeoJsonExplorer() {
  const { engine, state } = useTraffic()
  const [tab, setTab] = useState<Tab>("geojson")
  const preRef = useRef<HTMLPreElement>(null)

  // Source affichée : quartier actif si présent, sinon la plus récente.
  const source = useMemo(() => {
    // Recalcule à chaque mise à jour du moteur (données chargées/rafraîchies).
    void state.version
    const sources = engine.store.listSources()
    if (sources.length === 0) return null
    if (state.activeQuartier) {
      const match = sources.find(
        (s) => s.tag.kind === "quartier" && s.tag.id === state.activeQuartier!.id
      )
      if (match) return match
    }
    return [...sources].sort((a, b) => b.fetchedAt - a.fetchedAt)[0]
  }, [engine, state.activeQuartier, state.version])

  const doc = useMemo(
    () => (source ? buildJsonDocument(source.features) : null),
    [source]
  )

  const selectedKey = state.selected?.id ?? null

  // Scroll vers la feature sélectionnée quand on clique sur la carte.
  useEffect(() => {
    if (!doc || !selectedKey) return
    const range = doc.ranges.find(
      (r) => featureKey(r.feature) === selectedKey
    )
    if (!range) return
    const el = preRef.current?.querySelector<HTMLElement>(`[data-line="${range.start}"]`)
    el?.scrollIntoView({ block: "center" })
  }, [selectedKey, doc])

  if (!source || !doc) {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-background/90 backdrop-blur-md">
        <div className="border-b border-border/70 px-5 py-4">
          <h2 className="text-[15px] font-semibold tracking-tight">Explorateur GeoJSON</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Recherchez un quartier, ou cliquez sur la carte pour charger un
            secteur. Les données trafic apparaîtront ici au format GeoJSON.
          </p>
          <div className="mt-3">
            <Search />
          </div>
        </div>
      </div>
    )
  }

  const onLineClick = (line: number) => {
    if (!doc) return
    const range = rangeAtLine(doc.ranges, line)
    if (range) engine.selectRoute(range.feature)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-background/90 backdrop-blur-md">
      <header className="border-b border-border/70 px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="truncate text-[15px] font-semibold tracking-tight">
            {source.label}
          </h2>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {source.features.length} features
          </span>
        </div>
        {state.lastRequest && (
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-0.5 font-mono text-[10.5px] text-muted-foreground">
            <div>
              <dt className="sr-only">Requête</dt>
              <dd>
                <span className={state.lastRequest.error ? "text-destructive" : "text-primary"}>
                  {state.lastRequest.method}
                </span>{" "}
                {state.lastRequest.path} · {state.lastRequest.status}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Durée</dt>
              <dd>{state.lastRequest.durationMs} ms</dd>
            </div>
            {state.lastRequest.meta?.ageMs !== null &&
              state.lastRequest.meta?.ageMs !== undefined && (
                <div>
                  <dt className="sr-only">Âge serveur</dt>
                  <dd>age {state.lastRequest.meta.ageMs} ms</dd>
                </div>
              )}
            {state.lastRequest.meta?.partial && (
              <div>
                <dt className="sr-only">Partiel</dt>
                <dd className="text-[#e0b25c]">partial</dd>
              </div>
            )}
            {state.lastRequest.meta?.fallback && (
              <div>
                <dt className="sr-only">Repli</dt>
                <dd className="text-[#e0b25c]">fallback</dd>
              </div>
            )}
          </dl>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Search />
          <div className="flex rounded-sm border border-border/80" role="tablist" aria-label="Vue">
            {(
              [
                ["geojson", "GeoJSON"],
                ["features", "Features"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  "px-3 py-1.5 text-[12px] transition-colors",
                  tab === id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {doc.capped && (
        <p className="border-b border-border/60 px-5 py-2 text-[11px] text-muted-foreground">
          Affichage des 300 premières features sur {doc.total.toLocaleString("fr-FR")}.
        </p>
      )}

      {tab === "geojson" ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <pre
            ref={preRef}
            className="cursor-pointer py-3 font-mono text-[10.5px] leading-relaxed"
            onClick={(e) => {
              const target = e.target as HTMLElement
              const line = target.closest("[data-line]")?.getAttribute("data-line")
              if (line !== null && line !== undefined) onLineClick(Number(line))
            }}
          >
            {doc.lines.map((line, i) => {
              const inRange = doc.ranges.some(
                (r) =>
                  featureKey(r.feature) === selectedKey &&
                  i >= r.start &&
                  i < r.end
              )
              return (
                <div
                  key={i}
                  data-line={i}
                  className={cn(
                    "px-5 whitespace-pre transition-colors",
                    inRange
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground/90 hover:bg-accent/40"
                  )}
                >
                  {line}
                </div>
              )
            })}
          </pre>
        </div>
      ) : (
        <FeatureList />
      )}
    </div>
  )
}

function FeatureList() {
  const { engine, state } = useTraffic()
  const source = useMemo(() => {
    // Recalcule à chaque mise à jour du moteur (données chargées/rafraîchies).
    void state.version
    const sources = engine.store.listSources()
    if (sources.length === 0) return null
    if (state.activeQuartier) {
      const match = sources.find(
        (s) => s.tag.kind === "quartier" && s.tag.id === state.activeQuartier!.id
      )
      if (match) return match
    }
    return [...sources].sort((a, b) => b.fetchedAt - a.fetchedAt)[0]
  }, [engine, state.activeQuartier, state.version])

  const list = useMemo(
    () => (source ? source.features.slice(0, 300) : []),
    [source]
  )

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <ul>
        {list.map((f, i) => {
          const key = featureKey(f)
          const active = state.selected?.id === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => engine.selectRoute(f)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-3 px-5 py-2 text-left transition-colors",
                  active ? "bg-primary/15" : "hover:bg-accent/40"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] text-foreground">
                    {f.properties.name || `Feature ${i}`}
                  </span>
                  <span className="block font-mono text-[9.5px] text-muted-foreground/70">
                    {f.geometry.type}
                  </span>
                </span>
                <span className="shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatSpeed(f.properties.speed)} km/h
                  <span className="ml-2">{formatRate(f.properties.rate)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
