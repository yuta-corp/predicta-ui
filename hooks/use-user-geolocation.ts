"use client"

import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { toast } from "sonner"

import type { Map as MapLibreMap } from "maplibre-gl"

import {
  createCameraFollower,
  type CameraFollower,
  type FollowPosition,
} from "@/lib/map/follow-camera"
import { messageFromGeoError } from "@/lib/map/geolocation-messages"
import { getLiveMap, subscribeLiveMap } from "@/lib/map/map-registry"
import { createPositionFilter } from "@/lib/map/position-filter"
import {
  startUserLocationPulse,
  updateUserLocationSource,
} from "@/lib/map/user-location"

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 30_000,
}

/** Attente maximale du premier fix (permission + verrouillage). */
const FIRST_FIX_TIMEOUT_MS = 15_000

type Status = "idle" | "locating" | "active"
type PositionFilter = ReturnType<typeof createPositionFilter>
type WatchIdRef = React.RefObject<number | null>
type FixRef = React.RefObject<FollowPosition | null>

/** Coupe le suivi GPS au démontage (aucune surveillance fantôme). */
function useWatchCleanup(watchIdRef: WatchIdRef): void {
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [watchIdRef])
}

/** Redessine la dernière position connue à chaque reconstruction du style. */
function useStyleReloadRedraw(map: MapLibreMap | null, lastPositionRef: FixRef): void {
  useEffect(() => {
    if (!map) return
    const onStyleLoad = () => {
      const last = lastPositionRef.current
      if (last) updateUserLocationSource(map, last)
    }
    map.on("style.load", onStyleLoad)
    return () => {
      map.off("style.load", onStyleLoad)
    }
  }, [map, lastPositionRef])
}

/** Ondulation « live » autour du point, tant qu'une position est affichée. */
function useLocationPulse(map: MapLibreMap | null, active: boolean): void {
  useEffect(() => {
    if (!map || !active) return
    return startUserLocationPulse(map)
  }, [map, active])
}

/** Pause du recentrage pendant que l'utilisateur explore la carte. */
function useInteractionPause(
  map: MapLibreMap | null,
  followerRef: React.RefObject<CameraFollower>
): void {
  useEffect(() => {
    if (!map) return
    const markInteraction = () => followerRef.current.markInteraction()
    map.on("mousedown", markInteraction)
    map.on("wheel", markInteraction)
    map.on("touchstart", markInteraction)
    map.on("dragstart", markInteraction)
    return () => {
      map.off("mousedown", markInteraction)
      map.off("wheel", markInteraction)
      map.off("touchstart", markInteraction)
      map.off("dragstart", markInteraction)
    }
  }, [map, followerRef])
}

/**
 * Demande la position puis démarre le suivi continu. Le premier fix sert de
 * point d'ancrage : le watch prend le relais pour suivre les déplacements.
 */
function useGeolocationStarter(
  applyFix: (coords: GeolocationCoordinates) => void,
  watchIdRef: WatchIdRef,
  lastPositionRef: FixRef,
  filterRef: React.RefObject<PositionFilter>,
  followerRef: React.RefObject<CameraFollower>
) {
  const [status, setStatus] = useState<Status>("idle")

  const startWatch = useCallback(() => {
    if (watchIdRef.current !== null) return
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => applyFix(position.coords),
      () => {},
      GEO_OPTIONS
    )
  }, [applyFix, watchIdRef])

  const enable = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setStatus("locating")
    const loadingToastId = toast.loading("Recherche de votre position…")
    lastPositionRef.current = null
    filterRef.current.reset()
    followerRef.current.reset()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss(loadingToastId)
        applyFix(position.coords)
        setStatus("active")
        startWatch()
      },
      (err) => {
        toast.dismiss(loadingToastId)
        setStatus("idle")
        toast.error(messageFromGeoError(err), { duration: 6000 })
      },
      { ...GEO_OPTIONS, timeout: FIRST_FIX_TIMEOUT_MS }
    )
  }, [applyFix, startWatch, lastPositionRef, filterRef, followerRef])

  return { status, enable }
}

/**
 * Géolocalisation automatique — aucun bouton : dès que la carte est prête, le
 * navigateur demande la permission, puis le point + l'ondulation « live »
 * apparaissent et la caméra suit les déplacements. Refus et erreurs s'affichent
 * en toast, en français, sans message technique.
 */
export function useUserGeolocation(): void {
  // Se rend quand l'instance maplibre arrive (ou part).
  const [, forceRender] = useReducer((x: number) => x + 1, 0)
  useEffect(() => subscribeLiveMap(forceRender), [])
  const map = getLiveMap()

  const watchIdRef = useRef<number | null>(null)
  const lastPositionRef = useRef<FollowPosition | null>(null)
  // Filtre anti-tremblement : le point ne bouge que sur un fix significatif.
  const filterRef = useRef(createPositionFilter())
  const followerRef = useRef(createCameraFollower())
  // La demande automatique n'a lieu qu'une fois par session de page.
  const requestedRef = useRef(false)

  useWatchCleanup(watchIdRef)

  /** Applique un fix filtré : dessine la position, fait suivre la caméra. */
  const applyFix = useCallback((coords: GeolocationCoordinates) => {
    const committed = filterRef.current.next({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp: Date.now(),
    })
    // Fix trop proche / pas assez précis : le point affiché ne bouge pas.
    if (!committed) return

    const position: FollowPosition = {
      latitude: committed.latitude,
      longitude: committed.longitude,
      accuracy: committed.accuracy,
    }
    lastPositionRef.current = position
    const live = getLiveMap()
    if (!live) return
    updateUserLocationSource(live, position)
    followerRef.current.followIfNeeded(live, position)
  }, [])

  const { status, enable } = useGeolocationStarter(
    applyFix,
    watchIdRef,
    lastPositionRef,
    filterRef,
    followerRef
  )
  useStyleReloadRedraw(map, lastPositionRef)
  useLocationPulse(map, status === "active")
  useInteractionPause(map, followerRef)

  // Demande automatique : dès que la carte est prête, aucune interaction requise.
  useEffect(() => {
    if (!map || requestedRef.current) return
    requestedRef.current = true
    enable()
  }, [map, enable])
}
