"use client"

import { useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"

import type { Map as MapLibreMap } from "maplibre-gl"

import {
  removeFriendMarkers,
  syncFriendMarkers,
  type FriendMarkerRegistry,
} from "@/lib/map/friend-layer"
import { prefersReducedMotion } from "@/lib/map/city-style"
import { useMapFocusStore } from "@/lib/store/map-focus"
import type { FriendLocation } from "@/lib/types/social"

/** Recentre la caméra sur un ami sans quitter la carte. */
function useFriendRecenter(mapRef: React.RefObject<MapLibreMap | null>) {
  const recenterRef = useRef<(location: FriendLocation) => void>(() => {})

  const flyToFriend = useCallback(
    (location: FriendLocation) => {
      const map = mapRef.current
      if (!map) return
      map.flyTo({
        center: [location.longitude, location.latitude],
        // On ne dézoome jamais : l'ami reste un point identifiable.
        zoom: Math.max(map.getZoom(), 15),
        duration: prefersReducedMotion() ? 0 : 1400,
      })
    },
    [mapRef]
  )

  useEffect(() => {
    recenterRef.current = flyToFriend
  }, [flyToFriend])

  return recenterRef
}

interface FriendLayer {
  friendsRef: React.RefObject<FriendMarkerRegistry>
  friendLocationsRef: React.RefObject<FriendLocation[] | null>
  recenterRef: React.RefObject<(location: FriendLocation) => void>
  /** (Re)peint les marqueurs d'amis et leurs cercles de précision. */
  drawFriends: (map: MapLibreMap, locations: FriendLocation[] | null) => void
}

/**
 * Couche des amis : marqueurs, cercles de précision et recentrage.
 *
 * Les marqueurs sont reconstruits à chaque lot de positions (liste bornée :
 * les amis sont peu nombreux, et une position retirée disparaît aussitôt).
 * Normalisation faite ici, le composant carte n'a plus qu'à brancher.
 */
export function useFriendLayer(
  mapRef: React.RefObject<MapLibreMap | null>,
  friendLocations: FriendLocation[] | null
): FriendLayer {
  const friendsRef = useRef<FriendMarkerRegistry>(new Map())
  const friendLocationsRef = useRef<FriendLocation[] | null>(null)
  const recenterRef = useFriendRecenter(mapRef)

  const drawFriends = useCallback(
    (map: MapLibreMap, locations: FriendLocation[] | null) => {
      syncFriendMarkers(map, friendsRef.current, locations, (location) =>
        recenterRef.current(location)
      )
    },
    [recenterRef]
  )

  useEffect(() => {
    // Copie du registre : la ref peut changer avant l'arrêt.
    const registry = friendsRef.current
    friendLocationsRef.current = friendLocations
    const map = mapRef.current
    if (map && map.isStyleLoaded()) drawFriends(map, friendLocations)
    return () => {
      removeFriendMarkers(registry)
      friendLocationsRef.current = null
    }
  }, [friendLocations, drawFriends, mapRef])

  return { friendsRef, friendLocationsRef, recenterRef, drawFriends }
}

interface FriendFocusOptions {
  mapRef: React.RefObject<MapLibreMap | null>
  friendsRef: React.RefObject<FriendMarkerRegistry>
  recenterRef: React.RefObject<(location: FriendLocation) => void>
  friendLocations: FriendLocation[] | null
}

/**
 * Recentrage demandé depuis la cloche ou un lien profond (`?friend=`).
 *
 * La demande vit dans le store (la carte n'est pas remontée en changeant de
 * route). Dès que la position de l'ami est connue, on recentre, on ouvre sa
 * popup, et on consomme la demande. Si l'ami ne partage pas, on le dit.
 */
export function useFriendFocus({
  mapRef,
  friendsRef,
  recenterRef,
  friendLocations,
}: FriendFocusOptions): void {
  const focusedFriendId = useMapFocusStore((state) => state.friendId)
  const focusNonce = useMapFocusStore((state) => state.nonce)
  const clearFriendFocus = useMapFocusStore((state) => state.clearFriendFocus)

  useEffect(() => {
    if (!focusedFriendId) return
    // Carte pas encore prête : on garde la demande, l'effet repassera au load.
    if (mapRef.current === null) return

    const target = friendLocations?.find(
      (location) => location.userId === focusedFriendId
    )
    if (target) {
      recenterRef.current(target)
      const entry = friendsRef.current.get(target.userId)
      if (entry && !entry.popup.isOpen()) entry.marker.togglePopup()
      clearFriendFocus()
      return
    }

    // Positions chargées mais l'ami absent : il ne partage pas (ou ne m'a pas
    // autorisé). On le dit, plutôt que de laisser la carte immobile.
    if (friendLocations !== null) {
      clearFriendFocus()
      toast.info("Cet ami ne partage pas sa position pour le moment.")
    }
  }, [
    focusNonce,
    focusedFriendId,
    friendLocations,
    mapRef,
    friendsRef,
    recenterRef,
    clearFriendFocus,
  ])
}
