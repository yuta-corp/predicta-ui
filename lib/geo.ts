import type { Position, TrafficFeature } from "@/lib/types/traffic"
import type { Quartier } from "@/lib/types/traffic"
import { quartiers } from "@/lib/data/quartiers"

/** Centre approximatif du cœur urbain d'Antananarivo. */
export const TANA_CENTER: Position = [47.524, -18.909]

/** Clé de cellule de grille (cache des zones scannées). */
export function gridCellKey(lon: number, lat: number, size = 0.01): string {
  const x = Math.round(lon / size)
  const y = Math.round(lat / size)
  return `${x}:${y}`
}

/** Distance haversine en km entre deux positions [lon, lat]. */
export function haversineKm(a: Position, b: Position): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[1] - a[1])
  const dLon = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Quartier le plus proche d'un point (reverse geocoding pour les scans). */
export function nearestQuartier(
  lon: number,
  lat: number,
  radiusKm = 4
): Quartier | null {
  let best: Quartier | null = null
  let bestD = Infinity
  for (const q of quartiers) {
    const d = haversineKm([lon, lat], [q.lon, q.lat])
    if (d < bestD) {
      bestD = d
      best = q
    }
  }
  return best !== null && bestD <= radiusKm ? best : null
}

/** Quartiers les plus proches d'un point, triés par distance. */
export function quartiersNear(
  lon: number,
  lat: number,
  radiusKm: number,
  take: number
): Quartier[] {
  return quartiers
    .map((q) => ({ q, d: haversineKm([lon, lat], [q.lon, q.lat]) }))
    .filter((e) => e.d <= radiusKm)
    .sort((a, b) => a.d - b.d)
    .slice(0, take)
    .map((e) => e.q)
}

/**
 * Clé de déduplication d'un feature, basée sur la géométrie.
 * Le layer "speeds" ne produit que des lignes : on prend la première
 * composante (LineString) ou la première ligne (MultiLineString).
 */
export function featureKey(f: TrafficFeature): string {
  const g = f.geometry
  if (g.type === "LineString") return JSON.stringify(g.coordinates)
  return JSON.stringify(g.coordinates[0])
}

export interface BBox {
  west: number
  south: number
  east: number
  north: number
}

/** Bbox englobante des géométries d'une liste de features. */
export function bboxOfFeatures(features: TrafficFeature[]): BBox | null {
  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity
  for (const f of features) {
    const coords =
      f.geometry.type === "LineString"
        ? f.geometry.coordinates
        : f.geometry.coordinates.flat()
    for (const [lon, lat] of coords) {
      if (lon < west) west = lon
      if (lon > east) east = lon
      if (lat < south) south = lat
      if (lat > north) north = lat
    }
  }
  if (west === Infinity) return null
  return { west, south, east, north }
}

/** Bbox d'un feature unique. */
export function bboxOfFeature(f: TrafficFeature): BBox {
  const coords =
    f.geometry.type === "LineString"
      ? f.geometry.coordinates
      : f.geometry.coordinates.flat()
  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity
  for (const [lon, lat] of coords) {
    if (lon < west) west = lon
    if (lon > east) east = lon
    if (lat < south) south = lat
    if (lat > north) north = lat
  }
  return { west, south, east, north }
}

/** Extension d'une bbox par un facteur (autour de son centre). */
export function padBBox(
  bbox: BBox,
  factor: number
): { west: number; south: number; east: number; north: number } {
  const cx = (bbox.west + bbox.east) / 2
  const cy = (bbox.south + bbox.north) / 2
  const dw = ((bbox.east - bbox.west) * factor) / 2
  const dh = ((bbox.north - bbox.south) * factor) / 2
  const half = Math.max(dw, dh, 0.0015)
  return { west: cx - half, east: cx + half, south: cy - half, north: cy + half }
}
