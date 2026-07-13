"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { BUCKET_COLOR, BUCKET_LABEL, type Bucket } from "@/lib/congestion"

// Verre par thème : token --glass (clair/sombre) + hairline + ombre portée.
const GLASS =
  "rounded-xl border border-border bg-[var(--glass)] backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]"

// Révélation orchestrée : flou + montée, décalée par `delay`. Le moment d'entrée.
export function Reveal({
  show,
  delay = 0,
  className,
  children,
}: {
  show: boolean
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        show ? "translate-y-0 blur-0 opacity-100" : "translate-y-3 blur-sm opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Compteur odométre — anime vers la cible (signature éditoriale/industrielle).
function useCountUp(target: number | null, ms = 900) {
  const [val, setVal] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    if (target == null) return
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setVal(a + (target - a) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return target == null ? null : Math.round(val)
}

export function BrandMark() {
  return (
    <div className={cn(GLASS, "pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5")}>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--color-lime)] font-bold text-[var(--color-ink)] shadow-[0_0_24px_-6px_var(--color-lime)]">
        P
      </span>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold tracking-tight text-foreground">
          Predicta
        </p>
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
  const speed = useCountUp(summary.avgSpeed)
  const pct = useCountUp(summary.pctCongested)
  const total = useCountUp(summary.total || null)

  return (
    <div className={cn(GLASS, "pointer-events-auto w-56 px-4 py-3.5")}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-lime)] opacity-70" />
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-lime)]" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          En direct
        </span>
      </div>

      {/* nombre héros : mono tabulaire, animé */}
      <p className="mt-2.5 font-display text-[2.75rem] font-semibold leading-none tabular-nums text-foreground">
        {speed ?? "—"}
        <span className="ml-1.5 align-baseline text-sm font-normal text-muted-foreground">
          km/h
        </span>
      </p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        vitesse moyenne
      </p>

      {/* barre embouteillage */}
      {summary.pctCongested != null ? (
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Embouteillé
            </span>
            <span className="tabular-nums text-sm font-medium text-foreground">{pct}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-[var(--color-lime)] transition-[width] duration-700 ease-out"
              style={{ width: `${pct ?? 0}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
            {(total ?? 0).toLocaleString("fr-FR")} rues suivies
          </p>
        </div>
      ) : (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          En attente de données
        </p>
      )}

      {partial ? (
        <p className="mt-2.5 rounded bg-amber-500/15 px-2 py-1 text-[10px] text-amber-300">
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
        "group pointer-events-auto flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition hover:text-foreground",
      )}
    >
      <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
      MàJ {label} EAT
    </button>
  )
}
