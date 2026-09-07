"use client"

import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { toast } from "sonner"
import { getLiveMap, subscribeLiveMap } from "@/components/map/city-map"
import {
  startUserLocationPulse,
  updateUserLocationSource,
} from "@/lib/map/user-location"
import { createPositionFilter } from "@/lib/map/position-filter"
import { haversineKm } from "@/lib/geo"

/** Distance minimale de déplacement (m) avant de recentrer la caméra. */
const FOLLOW_THRESHOLD_M = 30

/**
 * Tant que l'utilisateur interagit avec la carte (drag, zoom…), la caméra ne
 * se recentre pas sur lui — la carte reste libre d'être explorée.
 */
const RECENTER_PAUSE_MS = 8_000

/** Messages d'erreur humains, par code GeolocationPositionError. */
const ERROR_MESSAGES: Record<number, string> = {
  1: "Localisation refusée. Autorisez l'accès à votre position puis réessayez.",
  2: "Impossible de connaître votre position sur cet appareil.",
  3: "Votre position n'a pas pu être déterminée. Réessayez dans un instant.",
}

const DEFAULT_ERROR =
  "Un problème est survenu avec la localisation. Réessayez dans un instant."

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Géolocalisation automatique — aucun bouton : dès que la carte est prête,
 * le navigateur demande la permission, puis le point + l'ondulation « live »
 * apparaissent à la position de l'utilisateur et la caméra suit ses
 * déplacements. Refus et erreurs s'affichent en toast (sonner), en français,
 * sans aucun message technique.
 *
 * Le composant ne rend rien : il ne fait que piloter la carte et les toasts.
 */
export function GeolocationControl() {
  // Se rend quand l'instance maplibre arrive (ou part) : on l'interroge à ce
  // moment-là, pas pendant le rendu (règle react-hooks/refs).
  const [, forceRender] = useReducer((x: number) => x + 1, 0)
  useEffect(() => subscribeLiveMap(forceRender), [])
  const map = getLiveMap()

  const [status, setStatus] = useState<"idle" | "locating" | "active">("idle")

  const watchIdRef = useRef<number | null>(null)
  // Suivi toujours actif : la caméra recentre sur l'utilisateur à chaque
  // déplacement significatif. Pas de bouton pour l'arrêter — la carte reste
  // libre d'être explorée entre deux déplacements.
  const followRef = useRef(true)
  const lastRecenterRef = useRef<{ lat: number; lon: number } | null>(null)
  const lastPositionRef = useRef<{
    latitude: number
    longitude: number
    accuracy?: number
  } | null>(null)
  // Filtre anti-tremblement : le point n'est redessiné que sur un fix
  // significatif (déplacement réel, précision nettement meilleure, ou
  // rassissement), pas à chaque callback brut de watchPosition.
  const filterRef = useRef(createPositionFilter())
  const lastInteractionRef = useRef(0)
  // La demande automatique n'a lieu qu'une fois par session de page.
  const requestedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [])

  // Changement de thème → le style est reconstruit (setStyle) et la source
  // repart vide : on redessine la dernière position connue à chaque rechargement.
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
  }, [map])

  // Ondulation « live » façon Instagram autour du point, tant qu'une position
  // est affichée. L'animation reprend seule après un changement de thème
  // (le style est reconstruit, la boucle attend les nouvelles couches).
  useEffect(() => {
    if (!map || status !== "active") return
    return startUserLocationPulse(map)
  }, [map, status])

  // Interaction avec la carte → la caméra ne se recentre pas pendant que
  // l'utilisateur explore (mêmes événements que la dérive du héros).
  useEffect(() => {
    if (!map) return
    const markInteraction = () => {
      lastInteractionRef.current = Date.now()
    }
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
  }, [map])

  /** Applique un fix filtré : dessine la position, recentre la caméra si suivi. */
  const applyFix = useCallback((coords: GeolocationCoordinates) => {
    const committed = filterRef.current.next({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      timestamp: Date.now(),
    })
    // Fix trop proche / pas assez précis : le point affiché ne bouge pas.
    if (!committed) return

    const position = {
      latitude: committed.latitude,
      longitude: committed.longitude,
      accuracy: committed.accuracy,
    }
    lastPositionRef.current = position
    const live = getLiveMap()
    if (live) updateUserLocationSource(live, position)

    if (!followRef.current || !live) return
    const last = lastRecenterRef.current
    const recenter = (zoom?: number) => {
      if (Date.now() - lastInteractionRef.current < RECENTER_PAUSE_MS) return
      if (reducedMotion()) {
        live.jumpTo({
          center: [position.longitude, position.latitude],
          ...(zoom !== undefined ? { zoom } : {}),
        })
      } else if (zoom !== undefined) {
        live.flyTo({
          center: [position.longitude, position.latitude],
          zoom,
          duration: 1400,
        })
      } else {
        live.easeTo({
          center: [position.longitude, position.latitude],
          duration: 800,
        })
      }
    }
    if (!last) {
      // Premier fix : on se rend sur la position, zoom adapté à la précision.
      lastRecenterRef.current = {
        lat: position.latitude,
        lon: position.longitude,
      }
      const zoom =
        position.accuracy > 500 ? 13 : position.accuracy > 100 ? 14 : 15
      recenter(zoom)
      return
    }
    const movedKm = haversineKm(
      [last.lon, last.lat],
      [position.longitude, position.latitude]
    )
    if (movedKm > FOLLOW_THRESHOLD_M / 1000) {
      lastRecenterRef.current = {
        lat: position.latitude,
        lon: position.longitude,
      }
      recenter()
    }
  }, [])

  /** Active la géolocalisation (permission demandée au navigateur). */
  const enable = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setStatus("locating")
    const loadingToastId = toast.loading("Recherche de votre position…")
    followRef.current = true
    lastRecenterRef.current = null
    filterRef.current.reset()
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(loadingToastId)
        applyFix(pos.coords)
        setStatus("active")
        // Suivi continu : le point suit les déplacements tant que la carte
        // est ouverte. Les erreurs ponctuelles du watch ne coupent pas le suivi.
        if (watchIdRef.current === null) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (p) => applyFix(p.coords),
            () => {},
            { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 }
          )
        }
      },
      (err) => {
        toast.dismiss(loadingToastId)
        setStatus("idle")
        toast.error(ERROR_MESSAGES[err.code] ?? DEFAULT_ERROR, {
          duration: 6000,
        })
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10_000 }
    )
  }, [applyFix])

  // Demande automatique : dès que la carte est prête, la position est
  // demandée au navigateur — aucune interaction requise.
  useEffect(() => {
    if (!map || requestedRef.current) return
    requestedRef.current = true
    enable()
  }, [map, enable])

  // Aucun rendu : le contrôle ne vit que par la carte et les toasts.
  return null
}