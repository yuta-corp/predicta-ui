"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Crosshair, MapPin, MapPinned } from "lucide-react"
import {
  Map as MapLibreMap,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getSharedLocation } from "@/lib/actions/location"
import { formatAccuracy, formatRelativeTime } from "@/lib/format"
import { updateSharedPosition } from "@/lib/map/shared-position"
import type { SharedLocation } from "@/lib/types/social"

// Le worker MapLibre n'existe pas dans le bundle Turbopack (dev) — même
// traitement que la ville : servi depuis /public et déclaré explicitement.
setWorkerUrl("/maplibre-gl-worker.mjs")

/** Cadence de rafraîchissement de la position partagée (côté serveur). */
const POLL_MS = 30_000

/** Cadence du compteur « mis à jour il y a … » (aucun appel serveur). */
const AGE_TICK_MS = 5_000

const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty"

const INITIAL_ZOOM = 15

interface ShareLiveViewProps {
  token: string
}

/**
 * Vue en direct d'une position partagée par lien (URL /share/:token).
 * Protégée par l'auth Clerk : sans session, le middleware redirige vers la
 * connexion en conservant l'URL de retour. Le token est le secret, pas l'accès
 * public.
 *
 * La précision publiée est affichée telle quelle (cercle + « ± X m ») : jamais
 * de point présenté comme exact alors qu'il ne l'est pas.
 */
export function ShareLiveView({ token }: ShareLiveViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const locationRef = useRef<SharedLocation | null>(null)
  const [location, setLocation] = useState<SharedLocation | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  /** Recentre la caméra sur la position partagée la plus récente. */
  const recenter = useCallback(() => {
    const map = mapRef.current
    const target = locationRef.current
    if (!map || !target) return
    map.flyTo({
      center: [target.longitude, target.latitude],
      zoom: Math.max(map.getZoom(), INITIAL_ZOOM),
      duration: 1200,
    })
  }, [])

  // Polling de la position ; la carte est créée à la réception du premier point
  // (impératif, pas via le rendu), puis le point se déplace.
  useEffect(() => {
    let disposed = false

    const fetchLocation = async () => {
      try {
        const next = await getSharedLocation(token)
        if (disposed) return
        setUnavailable(next === null)
        setLocation(next)
        locationRef.current = next
        if (!next) return

        if (!mapRef.current && containerRef.current) {
          const map = new MapLibreMap({
            container: containerRef.current,
            style: BASEMAP_STYLE,
            center: [next.longitude, next.latitude],
            zoom: INITIAL_ZOOM,
            attributionControl: false,
          })
          map.addControl(new NavigationControl({ showCompass: false }), "top-right")
          map.on("load", () => updateSharedPosition(map, next))
          mapRef.current = map
        } else if (mapRef.current) {
          updateSharedPosition(mapRef.current, next)
        }
      } catch {
        if (disposed) return
        setUnavailable(true)
        setLocation(null)
        locationRef.current = null
      }
    }

    void fetchLocation()
    const poll = setInterval(() => void fetchLocation(), POLL_MS)
    return () => {
      disposed = true
      clearInterval(poll)
      mapRef.current?.remove()
      mapRef.current = null
      locationRef.current = null
    }
  }, [token])

  // Ré-affichage du « mis à jour il y a … » sans re-solliciter le serveur.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), AGE_TICK_MS)
    return () => clearInterval(tick)
  }, [])

  const ageLabel = useMemo(
    () =>
      location
        ? formatRelativeTime(Math.max(0, now - location.updatedAt.getTime()))
        : "",
    [location, now]
  )

  const subtitle = location
    ? `Mise à jour ${ageLabel} · ${formatAccuracy(location.accuracy)}`
    : unavailable
      ? "Cette position n'est actuellement pas disponible."
      : "Chargement de la position…"

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-base font-bold tracking-tight">
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
          <p
            aria-live="polite"
            className="text-xs text-muted-foreground sm:text-sm"
          >
            {subtitle}
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

        {!location && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <MapPinned className="h-8 w-8 text-muted-foreground/60" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {unavailable
                ? "Le partage est arrêté, le lien a été révoqué ou la position est trop ancienne."
                : "En attente de la position…"}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Position partagée via Predicta — mise à jour automatique toutes les 30 secondes.
      </p>
    </main>
  )
}
