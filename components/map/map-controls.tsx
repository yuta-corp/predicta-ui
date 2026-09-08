"use client"

import { useEffect, useReducer } from "react"
import { LocateFixedIcon, MapPinned } from "lucide-react"
import { toast } from "sonner"
import { getLiveMap, subscribeLiveMap } from "@/components/map/city-map"
import {
  DEFAULT_ERROR,
  ERROR_MESSAGES,
} from "@/components/map/geolocation-control"
import { updateUserLocationSource } from "@/lib/map/user-location"
import { TANA_CENTER } from "@/lib/geo"

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Zoom adapté à la précision du dernier fix (route visible au premier regard). */
function zoomForAccuracy(accuracy: number): number {
  return accuracy > 500 ? 13 : accuracy > 100 ? 14 : 15
}

/**
 * Contrôles carte : retour au centre de la ville et « ma position ». Le suivi
 * automatique existe par ailleurs (GeolocationControl) ; ce bouton recentre
 * explicitement la caméra sur l'utilisateur — où qu'il soit, même hors de
 * Tana. Le zoom +/− est assuré par le NavigationControl natif de MapLibre.
 */
export function MapControls() {
  // Se rend quand l'instance maplibre arrive (ou part) : on l'interroge à ce
  // moment-là, pas pendant le rendu (règle react-hooks/refs).
  const [, forceRender] = useReducer((x: number) => x + 1, 0)
  useEffect(() => subscribeLiveMap(forceRender), [])
  const map = getLiveMap()
  if (!map) return null

  const resetView = () => {
    map.flyTo({
      center: [TANA_CENTER[0], TANA_CENTER[1]],
      zoom: 12.2,
      duration: 1100,
    })
  }

  const showMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    const loadingToastId = toast.loading("Recherche de votre position…")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(loadingToastId)
        const { latitude, longitude, accuracy } = pos.coords
        updateUserLocationSource(map, { latitude, longitude, accuracy })
        const zoom = zoomForAccuracy(accuracy)
        if (reducedMotion()) {
          map.jumpTo({ center: [longitude, latitude], zoom })
        } else {
          map.flyTo({ center: [longitude, latitude], zoom, duration: 1400 })
        }
      },
      (err) => {
        toast.dismiss(loadingToastId)
        toast.error(ERROR_MESSAGES[err.code] ?? DEFAULT_ERROR, {
          duration: 6000,
        })
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 }
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={showMyLocation}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
        aria-label="Voir ma position"
        title="Voir ma position"
      >
        <LocateFixedIcon className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={resetView}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
        aria-label="Revenir au centre de la ville"
      >
        <MapPinned className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}