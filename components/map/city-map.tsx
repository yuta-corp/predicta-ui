"use client"

import { createContext, useContext, useRef } from "react"
import { setWorkerUrl, type Map as MapLibreMap } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { useCityMap } from "@/hooks/use-city-map"
import { useFriendFocus, useFriendLayer } from "@/hooks/use-friend-layer"
import { useFriendsLocations } from "@/hooks/use-friends-locations"
import type { MapPulse, MapView } from "@/lib/map/city-map-runtime"
import { syncFriendAccuracy } from "@/lib/map/friend-layer"
import { cn } from "@/lib/utils"

// Le worker MapLibre n'existe pas dans le bundle Turbopack (dev) — on le sert
// depuis /public et on le déclare explicitement.
setWorkerUrl("/maplibre-gl-worker.mjs")

interface MapContextValue {
  view: MapView | null
}

/** Contexte de la carte : vue courante (lon/lat/zoom), lue par le chrome. */
export const MapContext = createContext<MapContextValue>({ view: null })

export function useMap() {
  return useContext(MapContext)
}

interface CityMapProps {
  className?: string
  /** false = pas de clic → scan (mode explorateur données). */
  interactive?: boolean
  /** Appelé quand la carte est prête (callback stable de préférence). */
  onReady?: () => void
  /** Dérive lente de la caméra (héros landing) — figée dès interaction,
   * désactivée en reduced-motion. */
  drift?: boolean
  /** Verrouille le thème sombre — ignore le clair/sombre du document. */
  forceDark?: boolean
  /** Verrouille le thème clair (mode blanc de la landing) — ignore le
   * clair/sombre du document. */
  forceLight?: boolean
  /** Contrôles de zoom natifs (masqués sur le voile de fond de la landing). */
  showControls?: boolean
}

/**
 * Carte de ville : cycle de vie dans `useCityMap`, peinture des couches dans
 * `lib/map/city-style`, positions des amis dans `hooks/use-friend-layer`.
 */
export function CityMap({
  className,
  interactive = true,
  onReady,
  drift = false,
  forceDark = false,
  forceLight = false,
  showControls = true,
}: CityMapProps) {
  const mapRef = useRef<MapLibreMap | null>(null)
  const { data: friendLocations } = useFriendsLocations()
  const { friendsRef, friendLocationsRef, recenterRef, drawFriends } =
    useFriendLayer(mapRef, friendLocations)

  useFriendFocus({ mapRef, friendsRef, recenterRef, friendLocations })

  const { containerRef, view, pulse } = useCityMap({
    interactive,
    onReady,
    drift,
    forceDark,
    forceLight,
    showControls,
    onMapCreated: (map) => {
      mapRef.current = map
    },
    // Positions des amis arrivées avant le chargement de la carte.
    onMapReady: (map) => drawFriends(map, friendLocationsRef.current),
    // Le style est reconstruit à chaque changement de thème (setStyle) : les
    // sources GeoJSON repartent vides, on redessine les cercles de précision.
    onStyleLoad: (map) => syncFriendAccuracy(map, friendLocationsRef.current),
  })

  return (
    <MapContext.Provider value={{ view }}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-background",
          className
        )}
      >
        {/* Style inline : la CSS non-layered de MapLibre (position:relative
            sur .maplibregl-map) écrase les utilitaires Tailwind en cascade
            layers — on force le positionnement ici. */}
        <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
        {/* Vignette douce pour la profondeur */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(20,26,12,0.14)_100%)]" />
        {pulse && (
          <div
            key={pulse.id}
            className="scan-pulse pointer-events-none absolute h-24 w-24 rounded-full border border-lime-400/70"
            style={{ left: pulse.x, top: pulse.y }}
          />
        )}
      </div>
    </MapContext.Provider>
  )
}

export type { MapPulse }
