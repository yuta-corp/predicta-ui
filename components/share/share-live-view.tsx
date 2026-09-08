"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MapPin, MapPinned } from "lucide-react"
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSharedLocation } from "@/lib/actions/location"
import type { SharedLocation } from "@/lib/types/social"

// Le worker MapLibre n'existe pas dans le bundle Turbopack (dev) — même
// traitement que la ville : servi depuis /public et déclaré explicitement.
setWorkerUrl("/maplibre-gl-worker.mjs")

/** Cadence de rafraîchissement de la position partagée. */
const POLL_MS = 30_000

const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty"

interface ShareLiveViewProps {
  token: string
}

/**
 * Vue en direct d'une position partagée par lien (URL /share/:token).
 * Protégée par l'auth Clerk : sans session, le middleware redirige vers la
 * connexion. Interroge l'action serveur régulièrement ; le token est le
 * secret, pas l'accès public.
 */
export function ShareLiveView({ token }: ShareLiveViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const [location, setLocation] = useState<SharedLocation | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  // Polling de la position ; la carte est créée à la réception du premier
  // point (impératif, pas via le rendu), puis le marqueur se déplace.
  useEffect(() => {
    let disposed = false

    const fetchLocation = async () => {
      try {
        const next = await getSharedLocation(token)
        if (disposed) return
        setUnavailable(next === null)
        setLocation(next)
        if (!next) return

        const { latitude, longitude } = next
        if (!mapRef.current && containerRef.current) {
          const map = new MapLibreMap({
            container: containerRef.current,
            style: BASEMAP_STYLE,
            center: [longitude, latitude],
            zoom: 15,
            attributionControl: false,
          })
          map.addControl(new NavigationControl({ showCompass: false }), "top-right")

          const element = document.createElement("div")
          element.className =
            "flex size-7 items-center justify-center rounded-full border-2 border-white bg-lime-500 shadow-md"
          const dot = document.createElement("span")
          dot.className = "size-2 rounded-full bg-white"
          element.appendChild(dot)

          markerRef.current = new Marker({ element })
            .setLngLat([longitude, latitude])
            .addTo(map)
          mapRef.current = map
        } else if (markerRef.current) {
          markerRef.current.setLngLat([longitude, latitude])
        }
      } catch {
        if (!disposed) {
          setUnavailable(true)
          setLocation(null)
        }
      }
    }

    void fetchLocation()
    const poll = setInterval(() => void fetchLocation(), POLL_MS)
    return () => {
      disposed = true
      clearInterval(poll)
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [token])

  // Ré-affichage du « mis à jour il y a X » sans re-solliciter le serveur.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 5_000)
    return () => clearInterval(tick)
  }, [])

  const ageSeconds = location ? Math.max(0, Math.floor((now - location.updatedAt.getTime()) / 1000)) : 0
  const ageLabel =
    ageSeconds < 60
      ? `à l'instant`
      : ageSeconds < 3600
        ? `il y a ${Math.floor(ageSeconds / 60)} min`
        : `il y a ${Math.floor(ageSeconds / 3600)} h`

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
        <div>
          <h1 className="text-base font-semibold sm:text-lg">
            {location ? `${location.sharerName} partage sa position` : "Position partagée"}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {location
              ? `Mise à jour ${ageLabel}`
              : unavailable
                ? "Cette position n'est actuellement pas disponible."
                : "Chargement de la position…"}
          </p>
        </div>
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