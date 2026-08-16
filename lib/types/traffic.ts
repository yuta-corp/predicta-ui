/**
 * Types stricts dérivés de docs/api.yml (Predicta API v1.0.0).
 * Contrat : GeoJSON RFC 7946, layer "speeds".
 */

/** Position WGS84 : [lon, lat]. */
export type Position = [number, number]

export type LineStringCoordinates = Position[]
export type MultiLineStringCoordinates = Position[][]

/** Géométrie ligne du layer "speeds" : LineString ou MultiLineString. */
export type LineGeometry =
  | { type: "LineString"; coordinates: LineStringCoordinates }
  | { type: "MultiLineString"; coordinates: MultiLineStringCoordinates }

/**
 * Propriétés d'un segment routier observé.
 * Toutes optionnelles : la source MVT peut ne pas fournir name/quartierId,
 * speed/rate (rien n'est requis par le schéma api.yml).
 */
export interface TrafficProperties {
  /** Nom de la route (tag MVT "name"). */
  name?: string
  /** Quartier du 1er point du segment (rel_<osmId>), posé par l'enrichissement OSM. */
  quartierId?: string
  /** Vitesse observée en km/h. */
  speed?: number
  /** Ratio vitesse observée / vitesse libre (congestion). */
  rate?: number
}

/** Un segment routier observé. */
export interface TrafficFeature {
  type: "Feature"
  properties: TrafficProperties
  geometry: LineGeometry
}

/** FeatureCollection GeoJSON des segments trafic. */
export interface TrafficFeatureCollection {
  type: "FeatureCollection"
  features: TrafficFeature[]
}

/** Quartier côté API : nom + centroïde (l'id n'est PAS exposé par /quartiers). */
export interface QuartierView {
  name: string
  lon: number
  lat: number
}

/** Source du quartier (colonne `source` de la table quartiers). */
export type QuartierSource =
  | "osm_admin"
  | "osm_suburb"
  | "osm_neighbourhood"
  | "osm_quarter"
  | "osm_locality"

/** Quartier complet : QuartierView + clé primaire + source (catalogue local). */
export interface Quartier extends QuartierView {
  id: string
  source: QuartierSource
}

/** Fraîcheur de la donnée, dérivée des en-têtes X-Predicta-*. */
export type TrafficFreshness = "live" | "cached" | "partial" | "fallback"

/** Méta-données trafic passées par le proxy depuis les en-têtes upstream. */
export interface TrafficMeta {
  /** Âge en ms si servi depuis le cache serveur (X-Predicta-Age), sinon null. */
  ageMs: number | null
  /** true si au moins une tuile a échoué (X-Predicta-Partial). */
  partial: boolean
  /** true si disque centroïde servi faute de géométrie (X-Predicta-Fallback). */
  fallback: boolean
  /** Horodatage local du fetch (pour calculer l'âge client). */
  fetchedAt: number
}

export interface TrafficResponse {
  data: TrafficFeatureCollection
  meta: TrafficMeta
}

export type APIErrorCode =
  | "unauthorized"
  | "not_found"
  | "upstream_error"
  | "timeout"
  | "network"
  | "invalid_request"
  | "not_configured"
  | "internal"

export interface APIError {
  code: APIErrorCode
  message: string
  status?: number
}

export function isAPIError(value: unknown): value is APIError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  )
}
