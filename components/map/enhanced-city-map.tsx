"use client"

import { useEffect, useRef } from "react"
import type {
  LayerSpecification,
  Map as MapLibreMap,
  MapGeoJSONFeature,
  MapMouseEvent,
} from "maplibre-gl"

import { getLiveMap } from "@/lib/map/map-registry"
import { CityMap } from "./city-map"

const HOVER_LAYER_ID = "traffic-hover-highlight"
const TRAFFIC_LAYERS = [
  "traffic-fluid",
  "traffic-moderate",
  "traffic-dense",
  "traffic-unknown",
]

/** Couleur de surbrillance : variable CSS du thème, sinon cyan de repli. */
function highlightColor(): string {
  const limeInk = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-lime-ink")
    .trim()
  return limeInk || "#00ffff"
}

/** Couche de surbrillance pilotée par l'état de feature « hover ». */
function hoverHighlightLayer(color: string): LayerSpecification {
  return {
    id: HOVER_LAYER_ID,
    type: "line",
    source: "traffic",
    "source-layer": "speeds",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": color,
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 5],
      "line-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.5, 0],
    },
  }
}

/** Ajoute la couche de survol, maintenant ou dès le prochain style chargé. */
function ensureHoverLayer(map: MapLibreMap, color: string): void {
  if (map.getLayer(HOVER_LAYER_ID)) return
  if (map.isStyleLoaded()) {
    map.addLayer(hoverHighlightLayer(color))
    return
  }
  const listener = () => {
    if (!map.getLayer(HOVER_LAYER_ID)) map.addLayer(hoverHighlightLayer(color))
    map.off("style.load", listener)
  }
  map.on("style.load", listener)
}

/** Easing par défaut plus doux (ignoré si l'utilisateur réduit les animations). */
function applyDefaultEasing(map: MapLibreMap): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) return
  if ("setDefaultEasing" in map && typeof map.setDefaultEasing === "function") {
    map.setDefaultEasing("cubic-bezier(0.25, 0.46, 0.45, 0.94)")
  }
}

type HoverIdRef = React.RefObject<string | null>

/** Efface l'état de survol courant (au départ du curseur ou au démontage). */
function clearHoverState(map: MapLibreMap, hoverIdRef: HoverIdRef): void {
  const id = hoverIdRef.current
  if (!id) return
  map.setFeatureState(
    { source: "traffic", sourceLayer: "speeds", id },
    { hover: false }
  )
  hoverIdRef.current = null
}

/** Survol d'une route : une seule route porte l'état « hover » à la fois. */
function attachHoverState(
  map: MapLibreMap,
  interactive: boolean,
  hoverIdRef: HoverIdRef
): () => void {
  let requestId = 0

  const onMouseMove = (event: MapMouseEvent) => {
    if (!interactive) return
    requestId += 1
    const current = requestId
    requestAnimationFrame(() => {
      if (current !== requestId) return // survol obsolète
      const features = map.queryRenderedFeatures(event.point, {
        layers: TRAFFIC_LAYERS,
      })
      const feature = features[0] as MapGeoJSONFeature | undefined
      const id = feature?.id?.toString()
      if (!id || id === hoverIdRef.current) {
        if (!id) clearHoverState(map, hoverIdRef)
        return
      }
      clearHoverState(map, hoverIdRef)
      map.setFeatureState({ source: "traffic", sourceLayer: "speeds", id }, { hover: true })
      hoverIdRef.current = id
    })
  }

  const canvas = map.getCanvas()
  const onMouseLeave = () => clearHoverState(map, hoverIdRef)

  map.on("mousemove", onMouseMove)
  canvas.addEventListener("mouseleave", onMouseLeave)
  return () => {
    map.off("mousemove", onMouseMove)
    canvas.removeEventListener("mouseleave", onMouseLeave)
    clearHoverState(map, hoverIdRef)
  }
}

/** Câble les améliorations sur une carte vivante. Renvoie l'arrêt. */
function enhanceMap(
  map: MapLibreMap,
  interactive: boolean,
  hoverIdRef: HoverIdRef
): () => void {
  applyDefaultEasing(map)
  ensureHoverLayer(map, highlightColor())
  return attachHoverState(map, interactive, hoverIdRef)
}

/** Attend l'arrivée de la carte puis applique les améliorations. */
function useMapEnhancements(interactive: boolean): void {
  const hoverIdRef = useRef<string | null>(null)

  useEffect(() => {
    let stop: (() => void) | null = null
    let timer: ReturnType<typeof setTimeout> | null = null
    let disposed = false

    const waitForMap = () => {
      if (disposed) return
      const map = getLiveMap()
      if (map) {
        stop = enhanceMap(map, interactive, hoverIdRef)
        return
      }
      timer = setTimeout(waitForMap, 50)
    }
    waitForMap()

    return () => {
      disposed = true
      if (timer) clearTimeout(timer)
      stop?.()
    }
  }, [interactive])
}

/**
 * Carte de ville enrichie : easing plus doux et surbrillance de survol par
 * état de feature, en plus de tout ce que fait {@link CityMap}.
 */
export function EnhancedCityMap(
  props: React.ComponentPropsWithoutRef<typeof CityMap>
) {
  useMapEnhancements(props.interactive ?? true)
  return <CityMap {...props} />
}
