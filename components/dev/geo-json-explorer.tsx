"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { Search } from "@/components/map/search"
import { useTraffic } from "@/hooks/use-traffic"
import { featureKey } from "@/lib/geo"
import { buildJsonDocument, rangeAtLine } from "@/lib/geojson/render"
import { formatRate, formatSpeed } from "@/lib/format"
import { cn } from "@/lib/utils"

type Tab = "geojson" | "features"
type Traffic = ReturnType<typeof useTraffic>

/**
 * Source affichée : quartier actif si présent, sinon la plus récente.
 * Recalcule à chaque mise à jour du moteur (données chargées/rafraîchies).
 */
function useExplorerSource({ engine, state }: Traffic) {
  return useMemo(() => {
    void state.version
    const sources = engine.store.listSources()
    if (sources.length === 0) return null
    const active = state.activeQuartier
    if (active) {
      const match = sources.find(
        (source) => source.tag.kind === "quartier" && source.tag.id === active.id
      )
      if (match) return match
    }
    return [...sources].sort((a, b) => b.fetchedAt - a.fetchedAt)[0]
  }, [engine, state.activeQuartier, state.version])
}

/** Métadonnées de la dernière requête réseau affichée. */
function RequestMeta({ request }: { request: NonNullable<Traffic["state"]["lastRequest"]> }) {
  const meta = request.meta
  return (
    <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-0.5 font-mono text-[10.5px] text-muted-foreground">
      <div>
        <dt className="sr-only">Requête</dt>
        <dd>
          <span className={request.error ? "text-destructive" : "text-primary"}>
            {request.method}
          </span>{" "}
          {request.path} · {request.status}
        </dd>
      </div>
      <div>
        <dt className="sr-only">Durée</dt>
        <dd>{request.durationMs} ms</dd>
      </div>
      {meta?.ageMs !== null && meta?.ageMs !== undefined && (
        <div>
          <dt className="sr-only">Âge serveur</dt>
          <dd>age {meta.ageMs} ms</dd>
        </div>
      )}
      {meta?.partial && (
        <div>
          <dt className="sr-only">Partiel</dt>
          <dd className="text-[#e0b25c]">partial</dd>
        </div>
      )}
      {meta?.fallback && (
        <div>
          <dt className="sr-only">Repli</dt>
          <dd className="text-[#e0b25c]">fallback</dd>
        </div>
      )}
    </dl>
  )
}

const TABS: [Tab, string][] = [
  ["geojson", "GeoJSON"],
  ["features", "Features"],
]

/** Bascule GeoJSON / Features. */
function ViewTabs({ tab, onTab }: { tab: Tab; onTab: (tab: Tab) => void }) {
  return (
    <div className="flex rounded-sm border border-border/80" role="tablist" aria-label="Vue">
      {TABS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onTab(id)}
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
  )
}

/** Corps GeoJSON : lignes cliquables, la sélection est surlignée. */
function JsonLines({
  doc,
  selectedKey,
  preRef,
  onLineClick,
}: {
  doc: NonNullable<ReturnType<typeof buildJsonDocument>>
  selectedKey: string | null
  preRef: React.RefObject<HTMLPreElement | null>
  onLineClick: (line: number) => void
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <pre
        ref={preRef}
        className="cursor-pointer py-3 font-mono text-[10.5px] leading-relaxed"
        onClick={(event) => {
          const line = (event.target as HTMLElement)
            .closest("[data-line]")
            ?.getAttribute("data-line")
          if (line !== null && line !== undefined) onLineClick(Number(line))
        }}
      >
        {doc.lines.map((line, index) => {
          const inRange = doc.ranges.some(
            (range) =>
              featureKey(range.feature) === selectedKey &&
              index >= range.start &&
              index < range.end
          )
          return (
            <div
              key={index}
              data-line={index}
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
  )
}

/** Corps « Features » : liste cliquable, la sélection est surlignée. */
function FeatureList() {
  const traffic = useTraffic()
  const { engine, state } = traffic
  const source = useExplorerSource(traffic)
  const list = useMemo(
    () => (source ? source.features.slice(0, 300) : []),
    [source]
  )

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <ul>
        {list.map((feature, index) => {
          const key = featureKey(feature)
          const active = state.selected?.id === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => engine.selectRoute(feature)}
                className={cn(
                  "flex w-full items-baseline justify-between gap-3 px-5 py-2 text-left transition-colors",
                  active ? "bg-primary/15" : "hover:bg-accent/40"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] text-foreground">
                    {feature.properties.name || `Feature ${index}`}
                  </span>
                  <span className="block font-mono text-[9.5px] text-muted-foreground/70">
                    {feature.geometry.type}
                  </span>
                </span>
                <span className="shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatSpeed(feature.properties.speed)} km/h
                  <span className="ml-2">{formatRate(feature.properties.rate)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** État vide : invite à rechercher un quartier ou cliquer la carte. */
function ExplorerEmpty() {
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

export function GeoJsonExplorer() {
  const traffic = useTraffic()
  const { engine, state } = traffic
  const [tab, setTab] = useState<Tab>("geojson")
  const preRef = useRef<HTMLPreElement>(null)

  const source = useExplorerSource(traffic)
  const doc = useMemo(
    () => (source ? buildJsonDocument(source.features) : null),
    [source]
  )
  const selectedKey = state.selected?.id ?? null

  // Scroll vers la feature sélectionnée quand on clique sur la carte.
  useEffect(() => {
    if (!doc || !selectedKey) return
    const range = doc.ranges.find((r) => featureKey(r.feature) === selectedKey)
    if (!range) return
    preRef.current
      ?.querySelector<HTMLElement>(`[data-line="${range.start}"]`)
      ?.scrollIntoView({ block: "center" })
  }, [selectedKey, doc])

  if (!source || !doc) return <ExplorerEmpty />

  const onLineClick = (line: number) => {
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
        {state.lastRequest && <RequestMeta request={state.lastRequest} />}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Search />
          <ViewTabs tab={tab} onTab={setTab} />
        </div>
      </header>

      {doc.capped && (
        <p className="border-b border-border/60 px-5 py-2 text-[11px] text-muted-foreground">
          Affichage des 300 premières features sur {doc.total.toLocaleString("fr-FR")}.
        </p>
      )}

      {tab === "geojson" ? (
        <JsonLines
          doc={doc}
          selectedKey={selectedKey}
          preRef={preRef}
          onLineClick={onLineClick}
        />
      ) : (
        <FeatureList />
      )}
    </div>
  )
}
