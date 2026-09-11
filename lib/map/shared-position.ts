import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl"

import { accuracyCircle } from "@/lib/map/user-location"

/**
 * Couches d'affichage d'une position partagée par lien (`/share/:token`) :
 * le point exact est accompagné du cercle de précision, pour que le lecteur
 * sache *à quel point* la position est fiable — pas seulement où elle est.
 */

/** Source GeoJSON unique : polygone de précision + point. */
export const SHARED_POSITION_SOURCE = "shared-position"

export const SHARED_POSITION_ACCURACY_LAYER = "shared-position-accuracy"
export const SHARED_POSITION_ACCURACY_OUTLINE_LAYER = "shared-position-accuracy-outline"
export const SHARED_POSITION_DOT_LAYER = "shared-position-dot"

/** Rayon maximal (m) du cercle de précision — au-delà, la carte se remplit. */
export const MAX_SHARED_ACCURACY_RADIUS_M = 5_000

export interface SharedPositionInput {
  latitude: number
  longitude: number
  accuracy: number | null
}

interface PositionFeature {
  type: "Feature"
  geometry:
    | { type: "Point"; coordinates: [number, number] }
    | { type: "Polygon"; coordinates: [number, number][][] }
  properties: Record<string, never>
}

interface PositionFeatureCollection {
  type: "FeatureCollection"
  features: PositionFeature[]
}

const EMPTY_COLLECTION: PositionFeatureCollection = {
  type: "FeatureCollection",
  features: [],
}

/** Construit la collection GeoJSON d'une position (cercle + point). */
export function buildSharedPositionGeoJson(
  position: SharedPositionInput
): PositionFeatureCollection {
  if (
    !Number.isFinite(position.latitude) ||
    !Number.isFinite(position.longitude) ||
    position.latitude < -90 ||
    position.latitude > 90 ||
    position.longitude < -180 ||
    position.longitude > 180
  ) {
    return EMPTY_COLLECTION
  }

  const features: PositionFeature[] = []
  const accuracy = position.accuracy
  if (typeof accuracy === "number" && Number.isFinite(accuracy) && accuracy > 0) {
    features.push({
      type: "Feature",
      geometry: accuracyCircle(
        position.longitude,
        position.latitude,
        Math.min(accuracy, MAX_SHARED_ACCURACY_RADIUS_M)
      ),
      properties: {},
    })
  }
  features.push({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [position.longitude, position.latitude],
    },
    properties: {},
  })

  return { type: "FeatureCollection", features }
}

/** Crée les couches si elles manquent (idempotent, après chaque load de style). */
export function ensureSharedPositionLayers(map: MapLibreMap): void {
  if (!map.getSource(SHARED_POSITION_SOURCE)) {
    map.addSource(SHARED_POSITION_SOURCE, { type: "geojson", data: EMPTY_COLLECTION })
  }
  if (!map.getLayer(SHARED_POSITION_ACCURACY_LAYER)) {
    map.addLayer({
      id: SHARED_POSITION_ACCURACY_LAYER,
      type: "fill",
      source: SHARED_POSITION_SOURCE,
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "fill-color": "rgba(132, 204, 22, 0.18)" },
    })
    map.addLayer({
      id: SHARED_POSITION_ACCURACY_OUTLINE_LAYER,
      type: "line",
      source: SHARED_POSITION_SOURCE,
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "line-color": "rgba(101, 163, 13, 0.55)", "line-width": 1 },
    })
  }
  if (!map.getLayer(SHARED_POSITION_DOT_LAYER)) {
    map.addLayer({
      id: SHARED_POSITION_DOT_LAYER,
      type: "circle",
      source: SHARED_POSITION_SOURCE,
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-color": "#84cc16",
        "circle-radius": 8,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#ffffff",
      },
    })
  }
}

/** Dessine la position partagée sur la carte (couches créées si nécessaire). */
export function updateSharedPosition(
  map: MapLibreMap,
  position: SharedPositionInput
): void {
  ensureSharedPositionLayers(map)
  const source = map.getSource(SHARED_POSITION_SOURCE)
  if (!source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(buildSharedPositionGeoJson(position))
}
