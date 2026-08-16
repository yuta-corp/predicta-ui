"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import type { Quartier } from "@/lib/types/traffic"
import { quartiers } from "@/lib/data/quartiers"
import { haversineKm, TANA_CENTER } from "@/lib/geo"
import { useTraffic } from "@/hooks/use-traffic"
import { cn } from "@/lib/utils"

const MAX_RESULTS = 8

function searchQuartiers(query: string): Quartier[] {
  const q = query.trim().toLocaleLowerCase("fr")
  if (!q) return []
  const starts: Quartier[] = []
  const contains: Quartier[] = []
  for (const quartier of quartiers) {
    const name = quartier.name.toLocaleLowerCase("fr")
    if (name.startsWith(q)) starts.push(quartier)
    else if (name.includes(q)) contains.push(quartier)
    if (starts.length + contains.length >= MAX_RESULTS * 2) break
  }
  return [...starts, ...contains].slice(0, MAX_RESULTS)
}

export function Search() {
  const { engine } = useTraffic()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => searchQuartiers(query), [query])

  // Raccourci clavier ⌘K / Ctrl+K.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    // Déféré hors du corps d'effet : réinitialisation + focus après ouverture.
    const raf = requestAnimationFrame(() => {
      setQuery("")
      setActive(0)
      inputRef.current?.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [open])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  const select = (q: Quartier) => {
    engine.selectQuartier(q)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault()
      select(results[active])
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-sm border border-border/80 bg-background/60 px-3 text-[13px] text-muted-foreground backdrop-blur-sm transition-colors hover:border-border hover:text-foreground"
        aria-label="Rechercher un quartier"
      >
        <SearchIcon className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Rechercher un quartier</span>
        <span className="ml-2 hidden rounded-[4px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
          ⌘K
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche de quartiers"
        >
          <div className="animate-rise w-full max-w-xl">
            <div className="overflow-hidden rounded-lg border border-border bg-background/90 shadow-[0_24px_64px_rgba(30,40,20,0.2)] backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-border/70 px-4">
                <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Quartier, adresse, repère…"
                  className="h-12 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Fermer la recherche"
                >
                  <XIcon className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <ul id="search-results" ref={listRef} role="listbox" className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <li className="px-4 py-3 text-[13px] text-muted-foreground">
                    {query.trim()
                      ? "Aucun quartier ne correspond à cette recherche."
                      : "Tapez un nom de quartier pour explorer Tana."}
                  </li>
                ) : (
                  results.map((q, i) => {
                    const distance = haversineKm([q.lon, q.lat], TANA_CENTER)
                    return (
                      <li key={q.id} role="option" aria-selected={i === active}>
                        <button
                          type="button"
                          data-index={i}
                          onClick={() => select(q)}
                          onMouseEnter={() => setActive(i)}
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13.5px] transition-colors",
                            i === active ? "bg-accent text-accent-foreground" : "text-foreground"
                          )}
                        >
                          <span className="truncate">{q.name}</span>
                          <span className="shrink-0 pl-4 text-[11px] text-muted-foreground">
                            {distance < 1
                              ? `${Math.round(distance * 1000)} m du centre`
                              : `${distance.toFixed(1)} km du centre`}
                          </span>
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
              Entrée pour explorer · Échap pour fermer
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
