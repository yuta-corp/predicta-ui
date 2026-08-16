"use client"

import { useEffect, useState } from "react"
import { useTraffic } from "@/hooks/use-traffic"
import { freshnessDetail, freshnessLine } from "@/lib/traffic/freshness"

/** Ligne d'état du trafic : fraîcheur, données partielles, erreurs. */
export function Freshness() {
  const { engine, state } = useTraffic()
  const [now, setNow] = useState(() => Date.now())

  // Tic d'affichage (1 s) — seul timer d'affichage, distinct des refresh réseau.
  const ticking = state.freshness !== null || state.busy
  useEffect(() => {
    if (!ticking) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [ticking])

  if (state.error) {
    return (
      <div className="animate-fade-in flex items-center gap-3 text-[12.5px]">
        <span className="text-foreground/85">{state.error}</span>
        <button
          type="button"
          onClick={() => engine.retry()}
          className="rounded-sm border-b border-primary/60 pb-px text-primary transition-colors hover:border-primary"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (state.busy && !state.freshness) {
    return (
      <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary/70" aria-hidden />
        <span>Chargement du trafic…</span>
      </div>
    )
  }

  if (!state.freshness) {
    return (
      <div className="text-[12.5px] text-muted-foreground/80">
        Cliquez sur la carte pour scanner un secteur de la ville.
      </div>
    )
  }

  const detail = freshnessDetail(state.freshness)

  return (
    <div className="animate-fade-in text-[12.5px] leading-snug">
      <p className="text-foreground/90">
        {freshnessLine(state.freshness, now)}
        {state.freshness.sourceLabel && (
          <span className="text-muted-foreground">
            {" · "}
            {state.freshness.sourceLabel}
          </span>
        )}
      </p>
      {detail && <p className="text-muted-foreground">{detail}</p>}
    </div>
  )
}
