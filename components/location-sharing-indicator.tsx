"use client"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { cn } from "@/lib/utils"

interface LocationSharingIndicatorProps {
  compact?: boolean
}

/** Pastille d'état du partage : vert = publié, ambre = en cours d'acquisition. */
export default function LocationSharingIndicator({
  compact = false,
}: LocationSharingIndicatorProps) {
  const { phase, error } = useLocationSharing()

  const label =
    phase === "sharing"
      ? "Position partagée"
      : phase === "locating"
        ? "Recherche de votre position…"
        : "Position privée"

  const dotClass =
    phase === "sharing"
      ? "animate-pulse bg-green-500"
      : phase === "locating"
        ? "animate-pulse bg-amber-400"
        : "bg-gray-300"

  if (compact) {
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
        title={error ?? label}
        aria-label={label}
      >
        <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      title={error ?? undefined}
    >
      <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      {label}
    </span>
  )
}
