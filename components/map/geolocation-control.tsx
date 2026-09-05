"use client"

import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { getLiveMap, subscribeLiveMap } from "@/components/map/city-map"
import {
  startUserLocationPulse,
  updateUserLocationSource,
} from "@/lib/map/user-location"
import { haversineKm } from "@/lib/geo"

/** Distance minimale de déplacement (m) avant de recentrer la caméra. */
const FOLLOW_THRESHOLD_M = 30

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
 * déplacements. Refus et erreurs s'affichent en bulle transitoire, en
 * français, sans aucun message technique.
 */
export function GeolocationControl() {
  // Se rend quand l'instance maplibre arrive (ou part) : on l'interroge à ce
  // moment-là, pas pendant le rendu (règle react-hooks/refs).
  const [, forceRender] = useReducer((x: number) => x + 1, 0)
  useEffect(() => subscribeLiveMap(forceRender), [])
  const map = getLiveMap()

  const [status, setStatus] = useState<"idle" | "locating" | "active">("idle")
  const [message, setMessage] = useState<string | null>(null)

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
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // La demande automatique n'a lieu qu'une fois par session de page.
  const requestedRef = useRef(false)

  const showMessage = useCallback((text: string) => {
    setMessage(text)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setMessage(null), 6000)
  }, [])

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
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

  /** Applique un fix : dessine la position, recentre la caméra si suivi. */
  const applyFix = useCallback((coords: GeolocationCoordinates) => {
    const position = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
    }
    lastPositionRef.current = position
    const live = getLiveMap()
    if (live) updateUserLocationSource(live, position)

    if (!followRef.current || !live) return
    const last = lastRecenterRef.current
    if (!last) {
      // Premier fix : on se rend sur la position, zoom adapté à la précision.
      lastRecenterRef.current = { lat: position.latitude, lon: position.longitude }
      const zoom =
        coords.accuracy > 500 ? 13 : coords.accuracy > 100 ? 14 : 15
      if (reducedMotion()) {
        live.jumpTo({ center: [position.longitude, position.latitude], zoom })
      } else {
        live.flyTo({
          center: [position.longitude, position.latitude],
          zoom,
          duration: 1400,
        })
      }
      return
    }
    const movedKm = haversineKm(
      [last.lon, last.lat],
      [position.longitude, position.latitude]
    )
    if (movedKm > FOLLOW_THRESHOLD_M / 1000) {
      lastRecenterRef.current = { lat: position.latitude, lon: position.longitude }
      if (reducedMotion()) {
        live.jumpTo({ center: [position.longitude, position.latitude] })
      } else {
        live.easeTo({
          center: [position.longitude, position.latitude],
          duration: 800,
        })
      }
    }
  }, [])

  /** Active la géolocalisation (permission demandée au navigateur). */
  const enable = useCallback(() => {
    if (!("geolocation" in navigator)) {
      showMessage("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setStatus("locating")
    followRef.current = true
    lastRecenterRef.current = null
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyFix(pos.coords)
        setStatus("active")
        // Suivi continu : le point suit les déplacements tant que la carte
        // est ouverte. Les erreurs ponctuelles du watch ne coupent pas le suivi.
        if (watchIdRef.current === null) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (p) => applyFix(p.coords),
            () => {},
            { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
          )
        }
      },
      (err) => {
        setStatus("idle")
        showMessage(ERROR_MESSAGES[err.code] ?? DEFAULT_ERROR)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10_000 }
    )
  }, [applyFix, showMessage])

  // Demande automatique : dès que la carte est prête, la position est
  // demandée au navigateur — aucune interaction requise.
  useEffect(() => {
    if (!map || requestedRef.current) return
    requestedRef.current = true
    enable()
  }, [map, enable])

  // Carte pas encore prête : la demande attend l'instance maplibre.
  if (!map) return null

  return (
    <div className="relative">
      {status === "locating" && (
        <div
          role="status"
          className="absolute bottom-12 right-0 z-50 w-56 animate-rise rounded-md border border-border bg-popover px-3 py-2 text-[12px] leading-snug text-popover-foreground shadow-[0_16px_48px_rgba(30,40,20,0.18)]"
        >
          Recherche de votre position…
        </div>
      )}
      {message && status !== "locating" && (
        <div
          role="status"
          className="absolute bottom-12 right-0 z-50 w-64 animate-rise rounded-md border border-border bg-popover px-3 py-2 text-[12px] leading-snug text-popover-foreground shadow-[0_16px_48px_rgba(30,40,20,0.18)]"
        >
          {message}
        </div>
      )}
    </div>
  )
}