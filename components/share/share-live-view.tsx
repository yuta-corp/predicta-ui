"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Crosshair, MapPin, MapPinned } from "lucide-react"

import { useSharedPosition } from "@/components/share/use-shared-position"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatAccuracy, formatRelativeTime } from "@/lib/format"
import type { SharedLocation } from "@/lib/types/social"

interface ShareLiveViewProps {
  token: string
}

/** Overlay affiché tant qu'aucune position n'est disponible. */
function WaitingOverlay({ unavailable }: { unavailable: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
      <MapPinned className="h-8 w-8 text-muted-foreground/60" aria-hidden />
      <p className="text-sm text-muted-foreground">
        {unavailable
          ? "Le partage est arrêté, le lien a été révoqué ou la position est trop ancienne."
          : "En attente de la position…"}
      </p>
    </div>
  )
}

/** Sous-titre : fraîcheur puis précision réelle de la position. */
function subtitleFor(
  location: SharedLocation | null,
  unavailable: boolean,
  ageLabel: string
): string {
  if (location) return `Mise à jour ${ageLabel} · ${formatAccuracy(location.accuracy)}`
  if (unavailable) return "Cette position n'est actuellement pas disponible."
  return "Chargement de la position…"
}

/**
 * Vue en direct d'une position partagée par lien (URL /share/:token).
 * Protégée par l'auth Clerk : sans session, le middleware redirige vers la
 * connexion en conservant l'URL de retour. Le token est le secret, pas l'accès
 * public. La précision publiée est affichée telle quelle : jamais de point
 * présenté comme exact alors qu'il ne l'est pas.
 */
export function ShareLiveView({ token }: ShareLiveViewProps) {
  const { containerRef, location, unavailable, now, recenter } =
    useSharedPosition(token)

  const ageLabel = useMemo(
    () =>
      location
        ? formatRelativeTime(Math.max(0, now - location.updatedAt.getTime()))
        : "",
    [location, now]
  )

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-base font-bold tracking-tight"
        >
          <MapPin className="h-4 w-4 text-lime-500" />
          Predicta
        </Link>
        <span className="text-xs text-muted-foreground">Partage de position</span>
      </header>

      <section className="mb-3 flex items-center gap-3">
        <Avatar>
          {location?.sharerImageUrl ? (
            <AvatarImage src={location.sharerImageUrl} alt={location.sharerName} />
          ) : (
            <AvatarFallback>{location?.sharerName.charAt(0) ?? "?"}</AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold sm:text-lg">
            {location ? `${location.sharerName} partage sa position` : "Position partagée"}
          </h1>
          <p aria-live="polite" className="text-xs text-muted-foreground sm:text-sm">
            {subtitleFor(location, unavailable, ageLabel)}
          </p>
        </div>
        {location && (
          <Button size="sm" variant="outline" onClick={recenter}>
            <Crosshair className="h-3.5 w-3.5" aria-hidden />
            Recentrer
          </Button>
        )}
      </section>

      <div
        className={`relative min-h-[320px] flex-1 overflow-hidden rounded-xl border border-border ${location ? "" : "bg-muted"}`}
      >
        <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
        {!location && <WaitingOverlay unavailable={unavailable} />}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Position partagée via Predicta — mise à jour automatique toutes les 30 secondes.
      </p>
    </main>
  )
}
