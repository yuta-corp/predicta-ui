"use client"

import { useMemo, useRef, useState } from "react"
import { SearchIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { useTraffic } from "@/hooks/use-traffic"
import { quartiers } from "@/lib/data/quartiers"
import type { Quartier } from "@/lib/types/traffic"
import { EASE, LineReveal } from "@/components/landing/motion-utils"
import { cn } from "@/lib/utils"

const MAX_RESULTS = 6

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
 * Scène 07 — VOTRE VILLE. EN TEMPS RÉEL.
 *
 * La recherche n'ouvre pas un menu : elle déplace la carte. Tapez un nom de
 * quartier — la caméra s'y glisse, le trafic s'installe. La carte de fond est
 * aussi une interface ici : cliquez, elle scanne.
 */
export function Recherche() {
  const { engine, state } = useTraffic()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchQuartiers(query), [query])
  const selectedName = state.activeQuartier?.name ?? null

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
    <section
      id="recherche"
      aria-label="Votre ville, en temps réel"
      className="pointer-events-none relative flex min-h-[115vh] items-start justify-center pt-[18vh]"
    >
      {/* Voile : la carte respire derrière la recherche. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-background via-background/50 to-transparent"
      />

      <div className="relative w-full max-w-2xl px-5 sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
          Votre ville
        </p>
        <LineReveal className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Votre ville. En temps réel.
        </LineReveal>

        {/* La recherche : taper, c'est déplacer la carte. */}
        <div className="pointer-events-auto relative mt-10">
          <div className="flex items-center gap-3 border-b border-foreground/25 pb-3 transition-colors focus-within:border-primary">
            <SearchIcon className="h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
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
              placeholder="Rechercher un quartier…"
              aria-label="Rechercher un quartier"
              role="combobox"
              aria-expanded={focused && results.length > 0}
              aria-controls="landing-search-results"
              className="h-10 w-full bg-transparent text-[17px] text-foreground outline-none placeholder:text-foreground/50"
            />
          </div>

          <AnimatePresence>
            {focused && query.trim() !== "" && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                id="landing-search-results"
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto border border-border bg-background/95 py-1.5 shadow-[0_24px_64px_rgba(30,40,20,0.18)]"
                role="listbox"
              >
                {results.length === 0 ? (
                  <li className="px-4 py-3 text-[13px] text-muted-foreground">
                    Aucun quartier ne correspond.
                  </li>
                ) : (
                  results.map((q, i) => (
                    <li key={q.id} role="option" aria-selected={i === active}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => select(q)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex w-full items-center justify-between px-4 py-2.5 text-left text-[14px] transition-colors",
                          i === active
                            ? "bg-primary/10 text-foreground"
                            : "text-foreground/85 hover:bg-primary/5"
                        )}
                      >
                        <span className="truncate">{q.name}</span>
                        {i === active && (
                          <span className="ml-4 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-ink">
                            explorer →
                          </span>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* La carte répond — l'état réel du moteur, en clair. */}
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedName ?? "idle"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-5 min-h-5 font-mono text-[11.5px] tracking-wide text-muted-foreground"
          >
            {selectedName
              ? `La carte se déplace vers ${selectedName}.`
              : "Tapez un nom — la carte s'y déplace. Ou cliquez la carte, elle scanne."}
          </motion.p>
        </AnimatePresence>

        <p className="mt-10 font-mono text-[11px] tracking-wide text-foreground/55">
          {quartiers.length} quartiers au catalogue · trafic servi en GeoJSON ·
          revalidation 45 s
        </p>
      </div>
    </section>
  )
}
