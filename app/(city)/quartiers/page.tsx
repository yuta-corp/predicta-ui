"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"
import type { Quartier } from "@/lib/types/traffic"
import { quartiers } from "@/lib/data/quartiers"
import { quartierTypeLabel } from "@/lib/quartier-labels"
import { useTraffic } from "@/hooks/use-traffic"
import { cn } from "@/lib/utils"

function filterQuartiers(query: string): Quartier[] {
  const q = query.trim().toLocaleLowerCase("fr")
  if (!q) return [...quartiers]
  const starts: Quartier[] = []
  const contains: Quartier[] = []
  for (const quartier of quartiers) {
    const name = quartier.name.toLocaleLowerCase("fr")
    if (name.startsWith(q)) starts.push(quartier)
    else if (name.includes(q)) contains.push(quartier)
  }
  return [...starts, ...contains]
}

function groupByLetter(list: Quartier[]): [string, Quartier[]][] {
  const groups = new Map<string, Quartier[]>()
  for (const q of list) {
    const c = /^[a-z]/i.test(q.name)
      ? q.name[0]!.toLocaleUpperCase("fr")
      : "#"
    const arr = groups.get(c) ?? []
    arr.push(q)
    groups.set(c, arr)
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "fr"))
}

export default function QuartiersPage() {
  const { engine } = useTraffic()
  const [query, setQuery] = useState("")

  const results = useMemo(() => filterQuartiers(query), [query])
  const groups = useMemo(() => groupByLetter(results), [results])

  return (
    <div className="pointer-events-none absolute inset-0">
      <aside
        className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[55dvh] flex-col overflow-hidden rounded-t-lg border border-border/80 bg-background/90 backdrop-blur-md md:inset-x-auto md:left-4 md:top-[68px] md:bottom-4 md:max-h-none md:w-[min(22rem,calc(100vw-2rem))] md:rounded-lg"
        aria-label="Index des quartiers"
      >
        <header className="border-b border-border/70 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
              Quartiers d'Antananarivo
            </h1>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {results.length}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-sm border border-border/80 bg-background px-3">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrer les quartiers"
              className="h-9 w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
              aria-label="Filtrer les quartiers"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {results.length === 0 ? (
            <p className="px-5 py-8 text-[13px] text-muted-foreground">
              Aucun quartier ne correspond à cette recherche.
            </p>
          ) : (
            groups.map(([letter, items]) => (
              <section key={letter} aria-label={`Quartiers commençant par ${letter}`}>
                <h2 className="sticky top-0 border-b border-border/50 bg-background/95 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                  {letter}
                </h2>
                <ul>
                  {items.map((q) => (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={() => engine.selectQuartier(q)}
                        className={cn(
                          "flex w-full items-baseline justify-between gap-3 px-5 py-2 text-left text-[13px] transition-colors hover:bg-accent/60",
                          "text-foreground"
                        )}
                      >
                        <span className="truncate">{q.name}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground/70">
                          {quartierTypeLabel(q.source)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
