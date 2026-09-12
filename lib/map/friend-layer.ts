/**
 * Synchronisation des amis sur la carte : cercles de précision (GeoJSON) et
 * marqueurs DOM (photo + popup). Le composant carte délègue ici, pour rester
 * court et ne garder que le cycle de vie.
 */

import { Marker, Popup, type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl"

import {
  buildFriendAccuracyGeoJson,
  buildFriendMarkerElement,
  buildFriendPopupElement,
  MAX_FRIENDS_ON_MAP,
} from "@/lib/map/friend-markers"
import type { FriendLocation } from "@/lib/types/social"

/** Marqueur + popup d'un ami, pour ouvrir la popup par programme. */
export interface FriendMarkerEntry {
  marker: Marker
  popup: Popup
}

export type FriendMarkerRegistry = Map<string, FriendMarkerEntry>

/** Dessine les cercles de précision des amis (ou rien si aucune position). */
export function syncFriendAccuracy(
  map: MapLibreMap,
  locations: FriendLocation[] | null
): void {
  const source = map.getSource("friend-accuracy")
  if (!source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(buildFriendAccuracyGeoJson(locations ?? []))
}

/** Retire tous les marqueurs d'amis et vide le registre. */
export function removeFriendMarkers(registry: FriendMarkerRegistry): void {
  for (const entry of registry.values()) entry.marker.remove()
  registry.clear()
}

/**
 * Reconstruit les marqueurs d'amis. Volontairement complet à chaque lot : les
 * amis sont peu nombreux (liste bornée) et une position retirée disparaît
 * aussitôt de la carte.
 */
export function syncFriendMarkers(
  map: MapLibreMap,
  registry: FriendMarkerRegistry,
  locations: FriendLocation[] | null,
  onRecenter: (location: FriendLocation) => void
): void {
  removeFriendMarkers(registry)
  syncFriendAccuracy(map, locations)
  if (!locations || locations.length === 0) return

  const now = Date.now()
  // Boucle bornée : au plus MAX_FRIENDS_ON_MAP marqueurs.
  const count = Math.min(locations.length, MAX_FRIENDS_ON_MAP)
  for (let index = 0; index < count; index += 1) {
    const location = locations[index]
    const popup = new Popup({ offset: 14, closeButton: true }).setDOMContent(
      buildFriendPopupElement(location, now, () => onRecenter(location))
    )
    const marker = new Marker({
      element: buildFriendMarkerElement(location, now),
    })
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      .addTo(map)
    registry.set(location.userId, { marker, popup })
  }
}
