/**
 * Registre de l'instance MapLibre vivante.
 *
 * Les contrôles (chrome de la carte : géolocalisation, contrôles de zoom) sont
 * des frères de la carte dans l'arbre : ils ne peuvent pas lire son contexte
 * interne. Ce registre leur permet d'obtenir l'instance au moment de
 * l'interaction, et d'être notifiés de son arrivée ou de son départ.
 *
 * On ne lit jamais la ref pendant le rendu : les composants s'abonnent.
 */

import type { Map as MapLibreMap } from "maplibre-gl"

let liveMap: MapLibreMap | null = null

const liveMapListeners = new Set<() => void>()

function notifyLiveMap(): void {
  for (const listener of liveMapListeners) listener()
}

/** Renvoie la carte affichée, ou null tant qu'aucune instance n'existe. */
export function getLiveMap(): MapLibreMap | null {
  return liveMap
}

/** S'abonne aux changements d'instance (arrivée / départ). */
export function subscribeLiveMap(listener: () => void): () => void {
  liveMapListeners.add(listener)
  return () => {
    liveMapListeners.delete(listener)
  }
}

/** Déclare la carte affichée (celle qui vient d'être créée). */
export function setLiveMap(map: MapLibreMap): void {
  liveMap = map
  notifyLiveMap()
}

/** Retire la carte affichée si c'est bien celle-ci (démontage idempotent). */
export function clearLiveMap(map: MapLibreMap): void {
  if (liveMap !== map) return
  liveMap = null
  notifyLiveMap()
}
