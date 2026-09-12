/**
 * Style de la carte de ville : basemap OpenFreeMap fusionné avec les couches
 * Predicta (graticule, trafic, sélection, position utilisateur, précision des
 * amis). Tout est ici, en fonctions courtes et pures : le composant carte ne
 * s'occupe que du cycle de vie, pas de la peinture.
 */

import { buildGraticule } from "@/lib/map/graticule"
import { USER_LOCATION_PULSE_LAYERS } from "@/lib/map/user-location"
import type {
  DataDrivenPropertyValueSpecification,
  FilterSpecification,
  LayerSpecification,
  SourceSpecification,
  StyleSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl"

export const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
} as const

/**
 * Tuiles MVT du trafic — fetch direct navigateur (technique tag-ip) : la carte
 * ne charge que les tuiles visibles, au bon zoom, et revalide via ETag (304).
 * Endpoint public (CORS) de l'API ; plage servie 12..16, overzoom au-delà.
 */
export const TRAFFIC_TILE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/traffic/tile/{z}/{x}/{y}.mvt`

/** Cadence de refresh des tuiles (revalidation HTTP, pas de re-téléchargement). */
export const TILE_REFRESH_MS = 45_000

/**
 * Basemap vecteur OpenFreeMap — le niveau de détail de predicta-ui.vercel.app :
 * bâtiments, arrêts de bus et POI (le style « liberty » fournit les couches
 * poi_transit / poi_r1/r7/r20 ; « dark » fournit bâtiments mais pas les POI,
 * on les injecte donc depuis liberty, sprite partagé). Sans clé, CORS ouvert,
 * tuiles jusqu'à z14 (overzoom au-delà).
 */
export const BASEMAP_STYLE = {
  light: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const

export const TILE_LAYERS = [
  "traffic-fluid",
  "traffic-moderate",
  "traffic-dense",
  "traffic-unknown",
] as const

export type ThemeName = "light" | "dark"

/** Palettes carte — clair (papier) et nuit (encre), appliquées aux couches trafic. */
const THEMES = {
  light: {
    bg: "#f2f4e9",
    graticule: "rgba(72, 86, 50, 0.06)",
    casing: "rgba(255, 255, 255, 0.9)",
    selected: "#9ccf3c",
  },
  dark: {
    bg: "#0b0d09",
    graticule: "rgba(226, 240, 208, 0.05)",
    casing: "rgba(5, 7, 4, 0.9)",
    selected: "#c0fe71",
  },
} as const

const TILE_COLORS: Record<
  (typeof TILE_LAYERS)[number],
  Record<ThemeName, string>
> = {
  "traffic-fluid": { light: "#7fae3f", dark: "#9fca69" },
  "traffic-moderate": { light: "#df9f3a", dark: "#e0b25c" },
  "traffic-dense": { light: "#d95f45", dark: "#dd6a4c" },
  "traffic-unknown": { light: "#b3b8a6", dark: "#54584e" },
}

const BUCKET_FILTERS: Record<(typeof TILE_LAYERS)[number], FilterSpecification> = {
  "traffic-fluid": ["all", ["has", "rate"], [">=", ["get", "rate"], 0.75]],
  "traffic-moderate": [
    "all",
    ["has", "rate"],
    ["<", ["get", "rate"], 0.75],
    [">=", ["get", "rate"], 0.5],
  ],
  "traffic-dense": ["all", ["has", "rate"], ["<", ["get", "rate"], 0.5]],
  "traffic-unknown": ["!", ["has", "rate"]],
}

/** Sources Predicta injectées dans le style du basemap. */
function predictaSources(): Record<string, SourceSpecification> {
  return {
    graticule: { type: "geojson", data: buildGraticule() },
    traffic: {
      type: "vector",
      tiles: [TRAFFIC_TILE_URL],
      minzoom: 12,
      maxzoom: 16,
    },
    selection: { type: "geojson", data: EMPTY_FEATURE_COLLECTION },
    hover: { type: "geojson", data: EMPTY_FEATURE_COLLECTION },
    "user-location": { type: "geojson", data: EMPTY_FEATURE_COLLECTION },
    "friend-accuracy": { type: "geojson", data: EMPTY_FEATURE_COLLECTION },
  }
}

/**
 * Cercles de précision des amis. Un cercle large est une information honnête :
 * il montre d'un coup d'œil que la position de l'ami est approximative, au lieu
 * de laisser croire à un point exact.
 */
function friendAccuracyLayers(isDark: boolean): LayerSpecification[] {
  const fill = isDark ? "rgba(96, 165, 250, 0.12)" : "rgba(37, 99, 235, 0.09)"
  const outline = isDark ? "rgba(147, 197, 253, 0.45)" : "rgba(37, 99, 235, 0.32)"
  return [
    {
      id: "friend-accuracy",
      type: "fill",
      source: "friend-accuracy",
      paint: { "fill-color": fill },
    },
    {
      id: "friend-accuracy-outline",
      type: "line",
      source: "friend-accuracy",
      paint: { "line-color": outline, "line-width": 1 },
    },
  ]
}

/** Couches Predicta (graticule, trafic) — sous les symboles du basemap. */
function predictaLayers(isDark: boolean): LayerSpecification[] {
  const palette = isDark ? THEMES.dark : THEMES.light
  const lineWidth: DataDrivenPropertyValueSpecification<number> = [
    "interpolate",
    ["linear"],
    ["zoom"],
    10,
    1.1,
    13,
    1.7,
    15,
    2.3,
  ]
  return [
    {
      id: "graticule",
      type: "line",
      source: "graticule",
      paint: { "line-color": palette.graticule, "line-width": 1 },
    },
    {
      id: "traffic-casing",
      type: "line",
      source: "traffic",
      "source-layer": "speeds",
      paint: {
        "line-color": palette.casing,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 5.2],
        "line-opacity": 0.9,
      },
    },
    ...TILE_LAYERS.map(
      (id): LayerSpecification => ({
        id,
        type: "line",
        source: "traffic",
        "source-layer": "speeds",
        filter: BUCKET_FILTERS[id],
        paint: {
          "line-color": TILE_COLORS[id][isDark ? "dark" : "light"],
          "line-width": lineWidth,
          "line-opacity": 0.92,
        },
      })
    ),
  ]
}

/** Couche de surbrillance de la route sélectionnée — toujours au-dessus de tout. */
function selectedLayer(isDark: boolean): LayerSpecification {
  const palette = isDark ? THEMES.dark : THEMES.light
  return {
    id: "route-selected",
    type: "line",
    source: "selection",
    layout: { "line-cap": "round" },
    paint: {
      "line-color": palette.selected,
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 4, 14, 6.5],
      "line-opacity": 0.95,
    },
  }
}

/** Surbrillance discrète de la route survolée — la ville répond au curseur. */
function hoverLayer(isDark: boolean): LayerSpecification {
  const palette = isDark ? THEMES.dark : THEMES.light
  return {
    id: "route-hover",
    type: "line",
    source: "hover",
    layout: { "line-cap": "round" },
    paint: {
      "line-color": palette.selected,
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2.2, 14, 3.4],
      "line-opacity": 0.65,
    },
  }
}

/**
 * Couches « vous êtes ici » : cercle de précision + point de localisation.
 * Toujours au-dessus de tout ; vides tant que l'utilisateur n'a pas activé
 * la géolocalisation (bouton dédié, pas de demande automatique).
 *
 * Deux anneaux d'ondulation (façon Instagram/WhatsApp « live »), décalés
 * d'une demi-période par startUserLocationPulse : ils s'étirent depuis le
 * point puis s'estompent, en boucle, sous le point lui-même.
 */
function userLocationLayers(isDark: boolean): LayerSpecification[] {
  const dot = isDark ? "#c0fe71" : "#9ccf3c"
  const halo = isDark ? "#0b0d09" : "#ffffff"
  const pulse = isDark ? "rgba(192, 254, 113, 0.75)" : "rgba(156, 207, 60, 0.7)"
  const accuracy = isDark ? "rgba(192, 254, 113, 0.13)" : "rgba(156, 207, 60, 0.16)"
  const accuracyOutline = isDark
    ? "rgba(192, 254, 113, 0.4)"
    : "rgba(156, 207, 60, 0.45)"
  const pulseLayers: LayerSpecification[] = USER_LOCATION_PULSE_LAYERS.map((id) => ({
    id,
    type: "circle",
    source: "user-location",
    filter: ["==", ["geometry-type"], "Point"],
    // Remplissage transparent : seul le contour (anneau) est dessiné.
    // L'animation pilote le rayon et circle-stroke-opacity (circle-opacity
    // ne fond que le remplissage dans MapLibre) ; contour invisible tant
    // que la boucle ne tourne pas.
    paint: {
      "circle-color": "rgba(0, 0, 0, 0)",
      "circle-radius": 14,
      "circle-stroke-width": 2,
      "circle-stroke-color": pulse,
      "circle-stroke-opacity": 0,
    },
  }))
  return [
    {
      id: "user-location-accuracy",
      type: "fill",
      source: "user-location",
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "fill-color": accuracy },
    },
    {
      id: "user-location-accuracy-outline",
      type: "line",
      source: "user-location",
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "line-color": accuracyOutline, "line-width": 1 },
    },
    ...pulseLayers,
    {
      id: "user-location-dot",
      type: "circle",
      source: "user-location",
      filter: ["==", ["geometry-type"], "Point"],
      paint: {
        "circle-color": dot,
        "circle-radius": 7.5,
        "circle-stroke-width": 2.5,
        "circle-stroke-color": halo,
      },
    },
  ]
}

/**
 * Volumes 3D des bâtiments — rendu « LOD2 visuel » appliqué aux deux thèmes :
 * coins arrondis, dégradé vertical des façades, et toits teintés par bandes
 * d'élévation pour hiérarchiser les îlots. La hauteur est légèrement exagérée
 * pour rester lisible au zoom urbain. `render_height`/`render_min_height` sont
 * calculés par OpenMapTiles depuis les tags OSM (building:levels/height).
 */
function building3dLayer(isDark: boolean): LayerSpecification[] {
  const facade = isDark
    ? ["#151a11", "#1d2317", "#28311f", "#35402a"]
    : ["#d9dbcd", "#e0e2d3", "#e9eadc", "#f1f2e6"]
  return [
    {
      id: "building-3d",
      type: "fill-extrusion",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 14,
      layout: { "fill-extrusion-rounded-corner-distance": 8 },
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "render_height"],
          0,
          facade[0],
          10,
          facade[1],
          25,
          facade[2],
          60,
          facade[3],
        ],
        "fill-extrusion-height": ["*", ["get", "render_height"], 1.2],
        "fill-extrusion-base": ["*", ["get", "render_min_height"], 1.2],
        "fill-extrusion-opacity": isDark ? 0.9 : 0.92,
        "fill-extrusion-vertical-gradient": true,
      },
    },
  ]
}

/**
 * Couches POI du style liberty (arrêts de bus, commerces…) injectées dans le
 * style dark, qui n'en fournit pas. Recolorées pour le fond sombre (sprite
 * partagé liberty/dark, donc les icônes existent).
 */
const DARK_POI_IDS = ["poi_transit", "poi_r20", "poi_r7", "poi_r1"] as const

async function darkPoiLayers(): Promise<LayerSpecification[]> {
  const liberty = await fetchStyle(BASEMAP_STYLE.light)
  const poiLayers = liberty.layers.filter(
    (layer): layer is SymbolLayerSpecification =>
      layer.type === "symbol" &&
      (DARK_POI_IDS as readonly string[]).includes(layer.id)
  )
  return poiLayers.map((layer) => ({
    ...layer,
    paint: {
      ...(layer.paint ?? {}),
      "text-color": "#d9e6cd",
      "text-halo-color": "rgba(8, 10, 7, 0.7)",
      "text-halo-width": 1,
    },
  }))
}

const RAW_STYLE_CACHE = new Map<string, Promise<StyleSpecification>>()

function fetchStyle(url: string): Promise<StyleSpecification> {
  let pending = RAW_STYLE_CACHE.get(url)
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`Basemap OpenFreeMap indisponible (${res.status}).`)
      }
      return res.json() as Promise<StyleSpecification>
    })
    RAW_STYLE_CACHE.set(url, pending)
  }
  return pending
}

const MERGED_STYLE_CACHE = new Map<ThemeName, Promise<StyleSpecification>>()

/** Style du basemap OpenFreeMap + couches Predicta, fusionnées (cache par thème). */
export function loadPredictaStyle(isDark: boolean): Promise<StyleSpecification> {
  const key: ThemeName = isDark ? "dark" : "light"
  let pending = MERGED_STYLE_CACHE.get(key)
  if (!pending) {
    pending = buildPredictaStyle(isDark)
    MERGED_STYLE_CACHE.set(key, pending)
  }
  return pending
}

async function buildPredictaStyle(isDark: boolean): Promise<StyleSpecification> {
  const base = await fetchStyle(isDark ? BASEMAP_STYLE.dark : BASEMAP_STYLE.light)
  const injected = predictaLayers(isDark)
  if (isDark) injected.push(...(await darkPoiLayers()))
  // Bâtiments 3D : on remplace la couche du basemap (liberty en fournit une)
  // par notre rendu « LOD2 visuel », commun aux deux thèmes.
  const layers = [...base.layers].filter((layer) => layer.id !== "building-3d")
  if (base.sources.openmaptiles) injected.push(...building3dLayer(isDark))
  // Les couches Predicta passent SOUS les symboles du basemap (noms de rues,
  // POI, arrêts de bus restent lisibles au-dessus du trafic).
  const firstSymbol = layers.findIndex((layer) => layer.type === "symbol")
  const at = firstSymbol === -1 ? layers.length : firstSymbol
  layers.splice(at, 0, ...injected)
  layers.push(hoverLayer(isDark))
  layers.push(selectedLayer(isDark))
  layers.push(...friendAccuracyLayers(isDark))
  layers.push(...userLocationLayers(isDark))
  return {
    ...base,
    sources: { ...base.sources, ...predictaSources() },
    layers,
  }
}

/** Fond de secours si OpenFreeMap est injoignable : papier + trafic, zéro basemap. */
export function fallbackStyle(isDark: boolean): StyleSpecification {
  const palette = isDark ? THEMES.dark : THEMES.light
  return {
    version: 8,
    sources: predictaSources(),
    layers: [
      { id: "bg", type: "background", paint: { "background-color": palette.bg } },
      ...predictaLayers(isDark),
      hoverLayer(isDark),
      selectedLayer(isDark),
      ...friendAccuracyLayers(isDark),
      ...userLocationLayers(isDark),
    ],
  }
}

/** Respecte le réglage système « réduire les animations ». */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
