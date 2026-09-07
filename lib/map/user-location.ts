import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl"

/** Source GeoJSON dédiée à la position de l'utilisateur sur la carte. */
export const USER_LOCATION_SOURCE = "user-location"

/**
 * Couches d'ondulation « live » (façon Instagram) : deux anneaux décalés d'une
 * demi-période qui s'étirent et s'estompent en boucle autour du point.
 */
export const USER_LOCATION_PULSE_LAYERS = [
  "user-location-pulse-0",
  "user-location-pulse-1",
] as const

const PULSE_PERIOD_MS = 2800
const PULSE_MIN_RADIUS = 16
const PULSE_MAX_RADIUS = 46

/**
 * Anime les deux anneaux de localisation (façon Instagram/WhatsApp « live ») :
 * un anneau s'étire depuis le point en s'estompant, l'autre démarre à
 * mi-période — l'ondulation est continue. Le rendu se fait en contour
 * (remplissage transparent), donc on pilote circle-stroke-opacity, pas
 * circle-opacity (qui ne fond que le remplissage dans MapLibre).
 *
 * En prefers-reduced-motion : un anneau statique discret, réappliqué si le
 * style est reconstruit (changement de thème). À appeler tant qu'une position
 * est affichée ; la fonction retournée arrête la boucle. Les couches sont
 * recréées par un changement de thème (setStyle) : la boucle reprend toute
 * seule dès qu'elles existent à nouveau.
 */
export function startUserLocationPulse(map: MapLibreMap): () => void {
  if (typeof window === "undefined") return () => {}
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Anneau fixe, sans mouvement — réappliqué si le style est reconstruit.
    const applyStatic = () => {
      const layer = USER_LOCATION_PULSE_LAYERS[0]
      if (!map.getLayer(layer)) return
      map.setPaintProperty(layer, "circle-radius", 24)
      map.setPaintProperty(layer, "circle-stroke-opacity", 0.45)
    }
    applyStatic()
    map.on("style.load", applyStatic)
    return () => {
      map.off("style.load", applyStatic)
    }
  }
  let raf = 0
  let alive = true
  const start = performance.now()
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
  const frame = (now: number) => {
    if (!alive) return
    const ready = USER_LOCATION_PULSE_LAYERS.every((id) => map.getLayer(id))
    if (ready) {
      const t = ((now - start) % PULSE_PERIOD_MS) / PULSE_PERIOD_MS
      USER_LOCATION_PULSE_LAYERS.forEach((id, i) => {
        const phase = (t + i / USER_LOCATION_PULSE_LAYERS.length) % 1
        const radius =
          PULSE_MIN_RADIUS +
          (PULSE_MAX_RADIUS - PULSE_MIN_RADIUS) * easeOut(phase)
        map.setPaintProperty(id, "circle-radius", radius)
        map.setPaintProperty(
          id,
          "circle-stroke-opacity",
          Math.pow(1 - phase, 1.4) * 0.65
        )
      })
    }
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
  return () => {
    alive = false
    cancelAnimationFrame(raf)
  }
}

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