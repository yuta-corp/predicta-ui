"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Map as MapLibreMap, NavigationControl, setWorkerUrl } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { getSharedLocation } from "@/lib/actions/location"
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

export interface SharedPositionView {
  containerRef: React.RefObject<HTMLDivElement | null>
  location: SharedLocation | null
  unavailable: boolean
  /** Horodatage courant (compteur d'ancienneté, sans appel serveur). */
  now: number
  recenter: () => void
}

/** Crée la carte au premier point reçu, puis la laisse suivre les mises à jour. */
function mountSharedMap(
  container: HTMLDivElement,
  location: SharedLocation
): MapLibreMap {
  const map = new MapLibreMap({
    container,
    style: BASEMAP_STYLE,
    center: [location.longitude, location.latitude],
    zoom: INITIAL_ZOOM,
    attributionControl: false,
  })
  map.addControl(new NavigationControl({ showCompass: false }), "top-right")
  map.on("load", () => updateSharedPosition(map, location))
  return map
}

/**
 * Position partagée par lien : polling serveur, carte créée au premier point,
 * et compteur d'ancienneté autonome.
 */
export function useSharedPosition(token: string): SharedPositionView {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const locationRef = useRef<SharedLocation | null>(null)
  const [location, setLocation] = useState<SharedLocation | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [now, setNow] = useState(() => Date.now())

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
          mapRef.current = mountSharedMap(containerRef.current, next)
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

  return { containerRef, location, unavailable, now, recenter }
}
