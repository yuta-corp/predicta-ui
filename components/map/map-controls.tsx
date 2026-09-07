"use client"

import { useEffect, useReducer } from "react"
import { LocateFixedIcon } from "lucide-react"
import { getLiveMap, subscribeLiveMap } from "@/components/map/city-map"
import { TANA_CENTER } from "@/lib/geo"

/**
 * Contrôles carte : retour au centre de la ville. Le zoom +/− est assuré par
 * le NavigationControl natif de MapLibre (en haut à droite, parité déploy).
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

  return (
    <button
      type="button"
      onClick={resetView}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
      aria-label="Revenir au centre de la ville"
    >
      <LocateFixedIcon className="h-4 w-4" aria-hidden />
    </button>
  )
}
