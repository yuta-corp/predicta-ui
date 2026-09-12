"use client"

import { useEffect, useRef, useState } from "react"

import type { Map as MapLibreMap } from "maplibre-gl"

import {
  createCityMap,
  type MapPulse,
  type MapView,
} from "@/lib/map/city-map-runtime"

interface UseCityMapOptions {
  interactive: boolean
  onReady?: () => void
  drift: boolean
  forceDark: boolean
  forceLight: boolean
  showControls: boolean
  /** Reçoit l'instance dès sa création (pour la garder dans une ref). */
  onMapCreated: (map: MapLibreMap) => void
  /** Redessine les amis dès que la carte est prête (positions déjà connues). */
  onMapReady: (map: MapLibreMap) => void
  /** Repeint la précision des amis après un changement de style. */
  onStyleLoad: (map: MapLibreMap) => void
}

/**
 * Monte la carte de ville dans un conteneur et l'arrête au démontage.
 *
 * Les callbacks (`onMapCreated`, `onMapReady`, `onStyleLoad`) capturent l'état
 * courant des amis : on les lit via une ref, ainsi la carte n'est **jamais**
 * recréée parce qu'un callback a changé d'identité. Seules les options de
 * montage déclenchent une re-création.
 */
export function useCityMap(options: UseCityMapOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<MapView | null>(null)
  const [pulse, setPulse] = useState<MapPulse | null>(null)

  // Les callbacks sont relus à chaque rendu dans une ref (mise à jour dans un
  // effet, pas pendant le rendu) : la carte n'est jamais recréée à cause d'eux.
  const callbacksRef = useRef(options)
  useEffect(() => {
    callbacksRef.current = options
  })

  const { interactive, onReady, drift, forceDark, forceLight, showControls } = options

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    return createCityMap({
      container,
      interactive,
      drift,
      forceDark,
      forceLight,
      showControls,
      onReady,
      onMapCreated: (map) => callbacksRef.current.onMapCreated(map),
      onMapReady: (map) => callbacksRef.current.onMapReady(map),
      onStyleLoad: (map) => callbacksRef.current.onStyleLoad(map),
      onView: setView,
      // Un scan identique ne provoque pas de re-rendu inutile.
      onPulse: (next) => setPulse((prev) => (prev?.id === next.id ? prev : next)),
    })
  }, [interactive, onReady, drift, forceDark, forceLight, showControls])

  return { containerRef, view, pulse }
}
