/**
 * Suivi de caméra : la carte suit l'utilisateur à chaque déplacement
 * significatif, sans se recentrer pendant qu'il explore la carte.
 */

import type { Map as MapLibreMap } from "maplibre-gl"

import { haversineKm } from "@/lib/geo"

/** Distance minimale de déplacement (m) avant de recentrer la caméra. */
export const FOLLOW_THRESHOLD_M = 30

/**
 * Tant que l'utilisateur interagit avec la carte (drag, zoom…), la caméra ne
 * se recentre pas sur lui — la carte reste libre d'être explorée.
 */
export const RECENTER_PAUSE_MS = 8_000

export interface FollowPosition {
  latitude: number
  longitude: number
  accuracy: number
}

export interface CameraFollower {
  /** Mémorise que l'utilisateur vient d'interagir (pause du recentrage). */
  markInteraction: () => void
  /** Repart de zéro (nouvelle session de suivi). */
  reset: () => void
  /** Recentre la caméra si le déplacement depuis le dernier recentrage le justifie. */
  followIfNeeded: (map: MapLibreMap, position: FollowPosition) => void
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function createCameraFollower(): CameraFollower {
  let lastInteractionAt = 0
  let lastRecentered: { lat: number; lon: number } | null = null

  const recenter = (
    map: MapLibreMap,
    position: FollowPosition,
    zoom?: number
  ): void => {
    if (Date.now() - lastInteractionAt < RECENTER_PAUSE_MS) return
    const center: [number, number] = [position.longitude, position.latitude]
    if (prefersReducedMotion()) {
      map.jumpTo({ center, ...(zoom !== undefined ? { zoom } : {}) })
    } else if (zoom !== undefined) {
      map.flyTo({ center, zoom, duration: 1400 })
    } else {
      map.easeTo({ center, duration: 800 })
    }
  }

  const followIfNeeded = (map: MapLibreMap, position: FollowPosition): void => {
    const previous = lastRecentered
    if (!previous) {
      // Premier fix : on se rend sur la position, zoom adapté à la précision.
      lastRecentered = { lat: position.latitude, lon: position.longitude }
      const zoom = position.accuracy > 500 ? 13 : position.accuracy > 100 ? 14 : 15
      recenter(map, position, zoom)
      return
    }
    const movedKm = haversineKm(
      [previous.lon, previous.lat],
      [position.longitude, position.latitude]
    )
    if (movedKm <= FOLLOW_THRESHOLD_M / 1000) return
    lastRecentered = { lat: position.latitude, lon: position.longitude }
    recenter(map, position)
  }

  return {
    markInteraction: () => {
      lastInteractionAt = Date.now()
    },
    reset: () => {
      lastRecentered = null
    },
    followIfNeeded,
  }
}
