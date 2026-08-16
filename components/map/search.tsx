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

/**
 * Recherche de quartiers — champ inline dans la barre de navigation.
 * On tape directement dans la barre, les résultats tombent en liste sous le
 * champ ; sélectionner un résultat déplace la carte sur le quartier.
 */
export function Search() {
  const { engine } = useTraffic()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => searchQuartiers(query), [query])
  const open = focused && query.trim() !== ""

  // Raccourci clavier ⌘K / Ctrl+K → focus la recherche directement.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") inputRef.current?.blur()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  const select = (q: Quartier) => {
    engine.selectQuartier(q)
    setQuery("")
    setActive(0)
    inputRef.current?.blur()
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
    } else if (e.key === "Escape") {
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-sm border bg-background/60 backdrop-blur-sm transition-colors",
          open ? "border-primary" : "border-border/80 focus-within:border-border"
        )}
      >
        <SearchIcon className="ml-2.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Rechercher un quartier"
          aria-label="Rechercher un quartier"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-results"
          className="h-9 w-32 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70 sm:w-44 lg:w-56"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setActive(0)
              inputRef.current?.focus()
            }}
            className="mr-1.5 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Effacer la recherche"
          >
            <XIcon className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : (
          <span className="mr-2 hidden shrink-0 rounded-[4px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline">
            ⌘K
          </span>
        )}
      </div>

      {open && (
        <ul
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Résultats de recherche"
          className="absolute right-0 top-full z-50 mt-2 w-72 max-h-80 overflow-y-auto rounded-md border border-border bg-background/95 py-2 shadow-[0_24px_64px_rgba(30,40,20,0.2)] backdrop-blur-md"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-[13px] text-muted-foreground">
              Aucun quartier ne correspond à cette recherche.
            </li>
          ) : (
            results.map((q, i) => {
              const distance = haversineKm([q.lon, q.lat], TANA_CENTER)
              return (
                <li key={q.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    data-index={i}
                    onMouseDown={(e) => e.preventDefault()}
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
      )}
    </div>
  )
}
