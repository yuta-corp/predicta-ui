import type {
  LineStringCoordinates,
  TrafficFeatureCollection,
} from "@/lib/types/traffic"

/** Étendue d'Antananarivo (bbox de la réponse /traffic). */
export const TANA_EXTENT = {
  west: 47.328,
  south: -19.105,
  east: 47.726,
  north: -18.728,
}

const STEP = 0.05

/**
 * Graticule cartographique : lignes de longitude/latitude espacées de 0.05°,
 * dans l'étendue de Tana. Fond discret sous les routes.
 */
export function buildGraticule(): TrafficFeatureCollection {
  const { west, south, east, north } = TANA_EXTENT
  const features: TrafficFeatureCollection["features"] = []

  for (let lon = Math.ceil(west / STEP) * STEP; lon <= east; lon += STEP) {
    const coords: LineStringCoordinates = [
      [lon, south],
      [lon, north],
    ]
    features.push({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: coords },
    })
  }
  for (let lat = Math.ceil(south / STEP) * STEP; lat <= north; lat += STEP) {
    const coords: LineStringCoordinates = [
      [west, lat],
      [east, lat],
    ]
    features.push({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: coords },
    })
  }

  return { type: "FeatureCollection", features }
}
