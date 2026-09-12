"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { useTraffic } from "@/hooks/use-traffic"
import { quartiers } from "@/lib/data/quartiers"
import { TANA_CENTER, haversineKm } from "@/lib/geo"
import type { Quartier } from "@/lib/types/traffic"
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

/** Raccourci ⌘K / Ctrl+K → focus la recherche ; Échap → blur. */
function useSearchShortcut(inputRef: React.RefObject<HTMLInputElement | null>): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === "Escape") inputRef.current?.blur()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [inputRef])
}

/** Garde le résultat actif visible dans la liste. */
function useActiveResultScroll(
  listRef: React.RefObject<HTMLUListElement | null>,
  active: number
): void {
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [listRef, active])
}

interface SearchBoxProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  query: string
  open: boolean
  onQueryChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
  onClear: () => void
}

/** Champ de recherche inline (barre de navigation). */
function SearchBox({
  inputRef,
  query,
  open,
  onQueryChange,
  onFocus,
  onBlur,
  onKeyDown,
  onClear,
}: SearchBoxProps) {
  return (
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
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
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
          onClick={onClear}
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
  )
}

interface KeyNavHandlers {
  results: Quartier[]
  active: number
  setActive: React.Dispatch<React.SetStateAction<number>>
  select: (quartier: Quartier) => void
  blur: () => void
}

/** Navigation clavier dans la liste de résultats (flèches, Entrée, Échap). */
function handleResultKeyDown(
  event: React.KeyboardEvent,
  { results, active, setActive, select, blur }: KeyNavHandlers
): void {
  if (event.key === "ArrowDown") {
    event.preventDefault()
    setActive((current) => Math.min(current + 1, results.length - 1))
    return
  }
  if (event.key === "ArrowUp") {
    event.preventDefault()
    setActive((current) => Math.max(current - 1, 0))
    return
  }
  if (event.key === "Enter" && results[active]) {
    event.preventDefault()
    select(results[active])
    return
  }
  if (event.key === "Escape") blur()
}

interface SearchResultsProps {
  results: Quartier[]
  active: number
  listRef: React.RefObject<HTMLUListElement | null>
  onSelect: (quartier: Quartier) => void
  onHover: (index: number) => void
}

/** Liste de résultats, avec distance au centre de Tana. */
function SearchResults({
  results,
  active,
  listRef,
  onSelect,
  onHover,
}: SearchResultsProps) {
  return (
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
        results.map((quartier, index) => {
          const distance = haversineKm([quartier.lon, quartier.lat], TANA_CENTER)
          return (
            <li key={quartier.id} role="option" aria-selected={index === active}>
              <button
                type="button"
                data-index={index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(quartier)}
                onMouseEnter={() => onHover(index)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13.5px] transition-colors",
                  index === active ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
              >
                <span className="truncate">{quartier.name}</span>
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
  )
}

/**
 * Recherche de quartiers — champ inline dans la barre de navigation. On tape
 * directement, les résultats tombent sous le champ ; sélectionner un résultat
 * déplace la carte sur le quartier.
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

  useSearchShortcut(inputRef)
  useActiveResultScroll(listRef, active)

  const changeQuery = (value: string) => {
    setQuery(value)
    setActive(0)
  }

  const select = (quartier: Quartier) => {
    engine.selectQuartier(quartier)
    setQuery("")
    setActive(0)
    inputRef.current?.blur()
  }

  return (
    <div className="relative">
      <SearchBox
        inputRef={inputRef}
        query={query}
        open={open}
        onQueryChange={changeQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) =>
          handleResultKeyDown(event, {
            results,
            active,
            setActive,
            select,
            blur: () => inputRef.current?.blur(),
          })
        }
        onClear={() => {
          changeQuery("")
          inputRef.current?.focus()
        }}
      />
      {open && (
        <SearchResults
          results={results}
          active={active}
          listRef={listRef}
          onSelect={select}
          onHover={setActive}
        />
      )}
    </div>
  )
}
