import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl"

/** Source GeoJSON dédiée à la position de l'utilisateur sur la carte. */
export const USER_LOCATION_SOURCE = "user-location"

/**
 * Polygone approximant le cercle de précision autour d'un point.
 * Conversion mètres → degrés avec compensation de latitude (1° de latitude
 * ≈ 111 320 m ; 1° de longitude ≈ 111 320 × cos(lat) m).
 */
function accuracyCircle(
  lon: number,
  lat: number,
  meters: number
): { type: "Polygon"; coordinates: [number, number][][] } {
  const latRad = (lat * Math.PI) / 180
  const dLat = meters / 111_320
  const dLon = meters / (111_320 * Math.cos(latRad))
  const steps = 36
  const ring: [number, number][] = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    ring.push([lon + dLon * Math.cos(t), lat + dLat * Math.sin(t)])
  }
  ring.push(ring[0])
  return { type: "Polygon", coordinates: [ring] }
}

export interface UserPosition {
  latitude: number
  longitude: number
  accuracy?: number
}

/** Dessine la position (cercle de précision + point) dans la source dédiée. */
export function updateUserLocationSource(
  map: MapLibreMap,
  position: UserPosition
): void {
  const source = map.getSource(USER_LOCATION_SOURCE)
  if (!source || source.type !== "geojson") return
  const { latitude, longitude, accuracy } = position
  const features: Array<{
    type: "Feature"
    geometry:
      | { type: "Point"; coordinates: [number, number] }
      | { type: "Polygon"; coordinates: [number, number][][] }
    properties: Record<string, never>
  }> = []
  if (accuracy && accuracy > 0) {
    features.push({
      type: "Feature",
      geometry: accuracyCircle(longitude, latitude, accuracy),
      properties: {},
    })
  }
  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [longitude, latitude] },
    properties: {},
  })
  ;(source as GeoJSONSource).setData({
    type: "FeatureCollection",
    features,
  })
}