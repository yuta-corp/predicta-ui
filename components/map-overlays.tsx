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
