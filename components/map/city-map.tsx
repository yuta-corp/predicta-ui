"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useFriendsLocations } from "@/hooks/use-friends-locations"
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type GeoJSONSource,
  type MapMouseEvent,
  type SourceSpecification,
} from "maplibre-gl"

// Le worker MapLibre n'existe pas dans le bundle Turbopack (dev) — on le sert
// depuis /public et on le déclare explicitement.
setWorkerUrl("/maplibre-gl-worker.mjs")
import type {
  DataDrivenPropertyValueSpecification,
  FilterSpecification,
  LayerSpecification,
  StyleSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

import { trafficEngine, type SelectedRoute } from "@/lib/traffic/engine"
import { USER_LOCATION_PULSE_LAYERS } from "@/lib/map/user-location"
import { buildGraticule } from "@/lib/map/graticule"
import { quartiersByLowerName } from "@/lib/data/quartiers"
import type { FriendLocation } from "@/lib/types/social"
import type { TrafficFeature, TrafficFeatureCollection } from "@/lib/types/traffic"
import { featureKey, TANA_CENTER } from "@/lib/geo"
import { cn } from "@/lib/utils"

const EMPTY_FC: TrafficFeatureCollection = { type: "FeatureCollection", features: [] }

/**
 * Tuiles MVT du trafic — fetch direct navigateur (technique tag-ip) : la carte
 * ne charge que les tuiles visibles, au bon zoom, et revalide via ETag (304).
 * Endpoint public (CORS) de l'API ; plage servie 12..16, overzoom au-delà.
 */
const TRAFFIC_TILE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/traffic/tile/{z}/{x}/{y}.mvt`

/** Cadence de refresh des tuiles (revalidation HTTP, pas de re-téléchargement). */
const TILE_REFRESH_MS = 45_000

/**
 * Basemap vecteur OpenFreeMap — le niveau de détail de predicta-ui.vercel.app :
 * bâtiments, arrêts de bus et POI (le style « liberty » fournit les couches
 * poi_transit / poi_r1/r7/r20 ; « dark » fournit bâtiments mais pas les POI,
 * on les injecte donc depuis liberty, sprite partagé). Sans clé, CORS ouvert,
 * tuiles jusqu'à z14 (overzoom au-delà).
 */
const BASEMAP_STYLE = {
  light: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const

const TILE_LAYERS = [
  "traffic-fluid",
  "traffic-moderate",
  "traffic-dense",
  "traffic-unknown",
] as const

/** Palettes carte — clair (papier) et nuit (encre), appliquées aux couches trafic. */
const THEMES = {
  light: {
    bg: "#f2f4e9",
    graticule: "rgba(72, 86, 50, 0.06)",
    casing: "rgba(255, 255, 255, 0.9)",
    selected: "#9ccf3c",
    fluid: "#7fae3f",
    moderate: "#df9f3a",
    dense: "#d95f45",
    unknown: "#b3b8a6",
  },
  dark: {
    bg: "#0b0d09",
    graticule: "rgba(226, 240, 208, 0.05)",
    casing: "rgba(5, 7, 4, 0.9)",
    selected: "#c0fe71",
    fluid: "#9fca69",
    moderate: "#e0b25c",
    dense: "#dd6a4c",
    unknown: "#54584e",
  },
} as const

type ThemeName = keyof typeof THEMES

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
    selection: { type: "geojson", data: EMPTY_FC },
    hover: { type: "geojson", data: EMPTY_FC },
    "user-location": { type: "geojson", data: EMPTY_FC },
  }
}

/** Couches Predicta (graticule, quartiers, trafic) — sous les symboles du basemap. */
function predictaLayers(isDark: boolean): LayerSpecification[] {
  const p = isDark ? THEMES.dark : THEMES.light
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
      paint: {
        "line-color": p.graticule,
        "line-width": 1,
      },
    },
    {
      id: "traffic-casing",
      type: "line",
      source: "traffic",
      "source-layer": "speeds",
      paint: {
        "line-color": p.casing,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 14, 5.2],
        "line-opacity": 0.9,
      },
    },
    ...(TILE_LAYERS.map((id): LayerSpecification => ({
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
    }))),
  ]
}

/** Couche de surbrillance de la route sélectionnée — toujours au-dessus de tout. */
function selectedLayer(isDark: boolean): LayerSpecification {
  const p = isDark ? THEMES.dark : THEMES.light
  return {
    id: "route-selected",
    type: "line",
    source: "selection",
    layout: { "line-cap": "round" },
    paint: {
      "line-color": p.selected,
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 4, 14, 6.5],
      "line-opacity": 0.95,
    },
  }
}

/** Surbrillance discrète de la route survolée — la ville répond au curseur. */
function hoverLayer(isDark: boolean): LayerSpecification {
  const p = isDark ? THEMES.dark : THEMES.light
  return {
    id: "route-hover",
    type: "line",
    source: "hover",
    layout: { "line-cap": "round" },
    paint: {
      "line-color": p.selected,
      "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2.2, 14, 3.4],
      "line-opacity": 0.65,
    },
  }
}

/** Dessine (ou efface) la route survolée dans la source dédiée. */
function syncHover(
  map: MapLibreMap,
  previous: TrafficFeature | null,
  next: TrafficFeature | null
) {
  const prevKey = previous ? featureKey(previous) : null
  const nextKey = next ? featureKey(next) : null
  if (prevKey === nextKey) return
  if (!map.getLayer("route-hover")) return
  const source = map.getSource("hover")
  if (!source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(
    next
      ? { type: "FeatureCollection", features: [next] }
      : EMPTY_FC
  )
}

/** Couches « vous êtes ici » : cercle de précision + point de localisation.
 * Toujours au-dessus de tout ; vides tant que l'utilisateur n'a pas activé
 * la géolocalisation (bouton dédié, pas de demande automatique).
 *
 * Deux anneaux d'ondulation (façon Instagram/WhatsApp « live »), décalés
 * d'une demi-période par startUserLocationPulse : ils s'étirent depuis le
 * point puis s'estompent, en boucle, sous le point lui-même. */
function userLocationLayers(isDark: boolean): LayerSpecification[] {
  const dot = isDark ? "#c0fe71" : "#9ccf3c"
  const halo = isDark ? "#0b0d09" : "#ffffff"
  const pulse = isDark ? "rgba(192, 254, 113, 0.75)" : "rgba(156, 207, 60, 0.7)"
  const accuracy = isDark
    ? "rgba(192, 254, 113, 0.13)"
    : "rgba(156, 207, 60, 0.16)"
  const accuracyOutline = isDark
    ? "rgba(192, 254, 113, 0.4)"
    : "rgba(156, 207, 60, 0.45)"
  const pulseLayers: LayerSpecification[] = USER_LOCATION_PULSE_LAYERS.map(
    (id) => ({
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
    })
  )
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

/** Couches POI du style liberty (arrêts de bus, commerces…) injectées dans le
 * style dark, qui n'en fournit pas. Recolorées pour le fond sombre (sprite
 * partagé liberty/dark, donc les icônes existent). */
const DARK_POI_IDS = ["poi_transit", "poi_r20", "poi_r7", "poi_r1"] as const

async function darkPoiLayers(): Promise<LayerSpecification[]> {
  const liberty = await fetchStyle(BASEMAP_STYLE.light)
  const poiLayers: SymbolLayerSpecification[] = liberty.layers.filter(
    (l): l is SymbolLayerSpecification =>
      l.type === "symbol" && (DARK_POI_IDS as readonly string[]).includes(l.id)
  )
  return poiLayers.map((l) => ({
    ...l,
    paint: {
      ...(l.paint ?? {}),
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

const MERGED_STYLE_CACHE = new Map<string, Promise<StyleSpecification>>()

/** Style du basemap OpenFreeMap + couches Predicta, fusionnées (cache par thème). */
function loadPredictaStyle(isDark: boolean): Promise<StyleSpecification> {
  const key = isDark ? "dark" : "light"
  let pending = MERGED_STYLE_CACHE.get(key)
  if (!pending) {
    pending = buildPredictaStyle(isDark)
    MERGED_STYLE_CACHE.set(key, pending)
  }
  return pending
}

async function buildPredictaStyle(isDark: boolean): Promise<StyleSpecification> {
  const url = isDark ? BASEMAP_STYLE.dark : BASEMAP_STYLE.light
  const base = await fetchStyle(url)
  const inject = predictaLayers(isDark)
  if (isDark) {
    inject.push(...(await darkPoiLayers()))
  }
  // Les couches Predicta passent SOUS les symboles du basemap (noms de rues,
  // POI, arrêts de bus restent lisibles au-dessus du trafic).
  const layers = [...base.layers]
  const firstSymbol = layers.findIndex((l) => l.type === "symbol")
  const at = firstSymbol === -1 ? layers.length : firstSymbol
  layers.splice(at, 0, ...inject)
  layers.push(hoverLayer(isDark))
  layers.push(selectedLayer(isDark))
  layers.push(...userLocationLayers(isDark))
  return {
    ...base,
    sources: { ...base.sources, ...predictaSources() },
    layers,
  }
}

/** Fond de secours si OpenFreeMap est injoignable : papier + trafic, zéro basemap. */
function fallbackStyle(isDark: boolean): StyleSpecification {
  const p = isDark ? THEMES.dark : THEMES.light
  return {
    version: 8,
    sources: predictaSources(),
    layers: [
      {
        id: "bg",
        type: "background",
        paint: { "background-color": p.bg },
      },
      ...predictaLayers(isDark),
      hoverLayer(isDark),
      selectedLayer(isDark),
      ...userLocationLayers(isDark),
    ],
  }
}

export interface MapView {
  lon: number
  lat: number
  zoom: number
}

interface MapContextValue {
  view: MapView | null
}

/** Contexte de la carte : vue courante (lon/lat/zoom), lue par le chrome. */
export const MapContext = createContext<MapContextValue>({ view: null })

export function useMap() {
  return useContext(MapContext)
}

// Registre de l'instance maplibre vivante (évite de lire une ref pendant
// le rendu — la règle react-hooks/refs). Les contrôles l'interrogent au
// moment de l'interaction.
let liveMap: MapLibreMap | null = null

export function getLiveMap(): MapLibreMap | null {
  return liveMap
}

// Les contrôles (chrome) sont des frères de la carte : ils ne peuvent pas lire
// son contexte interne. Ce registre leur notifie l'arrivée (ou le départ) de
// l'instance maplibre pour qu'ils se rendent au bon moment.
const liveMapListeners = new Set<() => void>()

export function subscribeLiveMap(listener: () => void): () => void {
  liveMapListeners.add(listener)
  return () => {
    liveMapListeners.delete(listener)
  }
}

function notifyLiveMap(): void {
  for (const listener of liveMapListeners) listener()
}

declare global {
  interface Window {
    __predictaMap?: MapLibreMap
    __predictaEngine?: typeof import("@/lib/traffic/engine").trafficEngine
  }
}

interface CityMapProps {
  className?: string
  /** false = pas de clic → scan (mode explorateur données). */
  interactive?: boolean
  /** Appelé quand la carte est prête (callback stable de préférence). */
  onReady?: () => void
  /** Dérive lente de la caméra (héros landing) — figée dès interaction,
   * désactivée en reduced-motion. */
  drift?: boolean
  /** Verrouille le thème sombre — ignore le clair/sombre du document. */
  forceDark?: boolean
  /** Verrouille le thème clair (mode blanc de la landing) — ignore le
   * clair/sombre du document. */
  forceLight?: boolean
  /** Contrôles de zoom natifs (masqués sur le voile de fond de la landing). */
  showControls?: boolean
}

export function CityMap({
  className,
  interactive = true,
  onReady,
  drift = false,
  forceDark = false,
  forceLight = false,
  showControls = true,
}: CityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const lastFocusId = useRef(0)
  const hoveredFeature = useRef<TrafficFeature | null>(null)

  const [pulse, setPulse] = useState<{ id: number; x: number; y: number } | null>(null)
  const [view, setView] = useState<MapView | null>(null)

  // --- Marqueurs des positions partagées des amis (polling dans le hook) ---
  const { data: friendLocations } = useFriendsLocations()
  const friendMarkersRef = useRef<Marker[]>([])
  const friendLocationsRef = useRef<FriendLocation[] | null>(null)

  const syncFriendMarkers = useCallback((locations: FriendLocation[] | null) => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    friendMarkersRef.current.forEach((marker) => marker.remove())
    friendMarkersRef.current = []
    friendLocationsRef.current = locations

    if (!locations || locations.length === 0) return

    locations.forEach((location) => {
      const element = document.createElement("div")
      element.className =
        "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-md"

      const dot = document.createElement("span")
      dot.className = "h-2 w-2 rounded-full bg-white"
      element.appendChild(dot)

      const content = document.createElement("div")
      content.className = "flex items-center gap-2 p-1"
      if (location.imageUrl) {
        const img = document.createElement("img")
        img.src = location.imageUrl
        img.alt = location.name
        img.className = "h-8 w-8 rounded-full"
        content.appendChild(img)
      }
      const info = document.createElement("div")
      const nameEl = document.createElement("p")
      nameEl.className = "text-sm font-medium"
      nameEl.textContent = location.name
      const timeEl = document.createElement("p")
      timeEl.className = "text-xs text-muted-foreground"
      timeEl.textContent = `Position mise à jour à ${location.updatedAt.toLocaleTimeString("fr-FR")}`
      info.append(nameEl, timeEl)
      content.appendChild(info)

      const marker = new Marker({ element })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(new Popup({ offset: 12 }).setDOMContent(content))
        .addTo(map)
      friendMarkersRef.current.push(marker)
    })
  }, [])

  // Rafraîchit les marqueurs à chaque lot de positions reçu ; les markers
  // sont retirés à la fermeture (le map.remove() de la carte les retire aussi).
  useEffect(() => {
    syncFriendMarkers(friendLocations)
    return () => {
      friendMarkersRef.current.forEach((marker) => marker.remove())
      friendMarkersRef.current = []
      friendLocationsRef.current = null
    }
  }, [friendLocations, syncFriendMarkers])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let disposed = false
    let cleanup: (() => void) | null = null

    // Chaque instance de carte ouvre une session vierge : sélection, focus
    // caméra, scan et requête affichée de l'exploration précédente (landing)
    // ne doivent jamais fuir dans /map (ou l'inverse). Le cache store reste.
    trafficEngine.resetExploration()

    // Deep-link /map?q=Analakely (recherche de la landing) : après le reset,
    // la session vierge reçoit sa destination. Le subscribe plus bas applique
    // ce focus dès que la carte est prête.
    const q = new URLSearchParams(window.location.search).get("q")
    if (q) {
      const quartier = quartiersByLowerName[q.trim().toLowerCase()]
      if (quartier) trafficEngine.selectQuartier(quartier)
    }

    const isDarkNow = () =>
      forceDark
        ? true
        : forceLight
          ? false
          : document.documentElement.classList.contains("dark")
    const initialDark = isDarkNow()

    // Style fusionné (basemap OpenFreeMap + trafic Predicta) chargé d'abord :
    // la carte naît directement avec le bon style, et le changement de thème
    // rebascule juste le style (liberty ↔ dark), tout est déjà dedans.
    void loadPredictaStyle(initialDark)
      .catch((error) => {
        console.error("Basemap OpenFreeMap indisponible — fond de secours.", error)
        return fallbackStyle(initialDark)
      })
      .then((style) => {
        if (disposed || !containerRef.current) return
        const map = new MapLibreMap({
          container,
          style,
          center: [TANA_CENTER[0], TANA_CENTER[1]],
          zoom: 12.2,
          minZoom: 8.5,
          maxZoom: 17,
          attributionControl: false,
          dragRotate: true,
          pitchWithRotate: false,
          fadeDuration: 120,
        })
        // Mode décor : la carte est un fond, aucune interaction possible
        // (molette, drag, double-clic, tactile, clavier). Seule la dérive
        // pilote la caméra — le récit, pas le visiteur.
        if (!interactive) {
          map.scrollZoom.disable()
          map.dragPan.disable()
          map.dragRotate.disable()
          map.touchZoomRotate.disable()
          map.doubleClickZoom.disable()
          map.boxZoom.disable()
          map.keyboard.disable()
          map.getCanvas().style.cursor = "default"
        }
        mapRef.current = map
        liveMap = map
        notifyLiveMap()
        if (process.env.NODE_ENV !== "production") {
          window.__predictaMap = map
          window.__predictaEngine = trafficEngine
        }
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches

        // Zoom natif +/− (parité déploy et tag-ip), sous la barre haute (CSS).
        // Masqué sur le voile de fond de la landing (la caméra y est pilotée
        // par le récit, pas par l'utilisateur).
        const zoomControl = new NavigationControl({ showCompass: false })
        if (showControls) map.addControl(zoomControl, "top-right")

        let refreshTimer: ReturnType<typeof setInterval> | null = null
        map.on("load", () => {
          syncSelection(map, trafficEngine.getSnapshot().selected)
          onReady?.()
          // Les positions des amis arrivées avant le chargement de la carte.
          syncFriendMarkers(friendLocationsRef.current)
          const c = map.getCenter()
          setView({ lon: c.lng, lat: c.lat, zoom: map.getZoom() })
          // Refresh périodique des tuiles (technique tag-ip) : MapLibre revalide
          // via ETag → 304, pas de re-téléchargement des tuiles inchangées.
          if (!refreshTimer) {
            refreshTimer = setInterval(() => {
              if (map.getSource("traffic")) map.refreshTiles("traffic")
            }, TILE_REFRESH_MS)
          }

        })

        // --- Dérive lente de la caméra (ville vivante, héros landing) ---
        // Lissajous autour du centre de Tana, pause après toute interaction.
        let driftTimer: ReturnType<typeof setInterval> | null = null
        if (drift && !reducedMotion) {
          let lastInteraction = 0
          const markInteraction = () => {
            lastInteraction = Date.now()
          }
          map.on("mousedown", markInteraction)
          map.on("wheel", markInteraction)
          map.on("touchstart", markInteraction)
          map.on("dragstart", markInteraction)
          driftTimer = setInterval(() => {
            if (disposed) return
            if (Date.now() - lastInteraction < 8000) return
            const t = Date.now()
            map.easeTo({
              center: [
                TANA_CENTER[0] + 0.014 * Math.sin(t / 42000),
                TANA_CENTER[1] + 0.01 * Math.cos(t / 54000),
              ],
              duration: 16000,
            })
          }, 20000)
          cleanup = () => {
            if (driftTimer) clearInterval(driftTimer)
            map.off("mousedown", markInteraction)
            map.off("wheel", markInteraction)
            map.off("touchstart", markInteraction)
            map.off("dragstart", markInteraction)
          }
        }

        // --- Thème : le basemap suit le clair/sombre (liberty ↔ dark) ---
        // Verrouillé quand forceDark / forceLight (voile narratif de la landing).
        const applyTheme = (isDark: boolean) => {
          void loadPredictaStyle(isDark).then((next) => {
            if (map.isStyleLoaded()) map.setStyle(next)
          })
        }
        const themeObserver = new MutationObserver(() => {
          if (forceDark || forceLight) return
          applyTheme(isDarkNow())
        })
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        })

        const onViewChange = () => {
          const c = map.getCenter()
          setView({ lon: c.lng, lat: c.lat, zoom: map.getZoom() })
        }
        map.on("moveend", onViewChange)

        // --- Caméra + scan + sélection : état du moteur ---
        const applyEngine = () => {
          const state = trafficEngine.getSnapshot()

          const focus = state.focus
          if (focus && focus.id !== lastFocusId.current) {
            lastFocusId.current = focus.id
            if (focus.type === "point") {
              map.flyTo({
                center: [focus.lon, focus.lat],
                zoom: focus.zoom,
                duration: reducedMotion ? 0 : 1400,
              })
            } else {
              const [w, s, e, n] = focus.bbox
              map.fitBounds(
                [
                  [w, s],
                  [e, n],
                ],
                {
                  padding: { top: 160, bottom: 140, left: 140, right: 140 },
                  duration: reducedMotion ? 0 : 1200,
                }
              )
            }
          }

          const scan = state.scan
          if (scan) {
            const p = map.project([scan.lon, scan.lat])
            setPulse((prev) => (prev?.id === scan.id ? prev : { id: scan.id, x: p.x, y: p.y }))
          }

          syncSelection(map, state.selected)
        }
        const unsubscribeEngine = trafficEngine.subscribe(applyEngine)
        applyEngine()

        // --- Clic : route → sélection, vide → scan ---
        const onMapClick = (e: MapMouseEvent) => {
          if (!interactive) return
          const x = e.point.x
          const y = e.point.y
          const hits = map.queryRenderedFeatures(
            [
              [x - 6, y - 6],
              [x + 6, y + 6],
            ],
            { layers: [...TILE_LAYERS] }
          )
          const hit = hits[0] as TrafficFeature | undefined
          if (hit) {
            trafficEngine.selectRoute(hit)
          } else {
            const { lng, lat } = e.lngLat
            trafficEngine.scanPoint(lng, lat)
          }
        }
        map.on("click", onMapClick)

        let cursorRaf = 0
        const onMouseMove = (e: MapMouseEvent) => {
          cancelAnimationFrame(cursorRaf)
          cursorRaf = requestAnimationFrame(() => {
            if (!interactive) return
            const hits = map.queryRenderedFeatures(
              [
                [e.point.x - 3, e.point.y - 3],
                [e.point.x + 3, e.point.y + 3],
              ],
              { layers: [...TILE_LAYERS] }
            )
            map.getCanvas().style.cursor = hits.length > 0 ? "pointer" : ""
            // Survol : la route survolée se détache doucement du réseau.
            // (sélection discrète — voir la couche route-hover).
            const hit = (hits[0] ?? null) as TrafficFeature | null
            syncHover(map, hoveredFeature.current, hit)
            hoveredFeature.current = hit
          })
        }
        map.on("mousemove", onMouseMove)
        // MapLibre n'expose pas d'événement « mouseleave » — on écoute le
        // canvas lui-même pour effacer la surbrillance en sortie de carte.
        const canvasEl = map.getCanvas()
        const onMouseLeave = () => {
          cancelAnimationFrame(cursorRaf)
          syncHover(map, hoveredFeature.current, null)
          hoveredFeature.current = null
        }
        canvasEl.addEventListener("mouseleave", onMouseLeave)

        const prevCleanup = cleanup
        cleanup = () => {
          prevCleanup?.()
          if (refreshTimer) clearInterval(refreshTimer)
          cancelAnimationFrame(cursorRaf)
          if (showControls) map.removeControl(zoomControl)
          unsubscribeEngine()
          themeObserver.disconnect()
          map.off("click", onMapClick)
          map.off("mousemove", onMouseMove)
          map.getCanvas().removeEventListener("mouseleave", onMouseLeave)
          map.off("moveend", onViewChange)
          map.remove()
          if (liveMap === map) {
            liveMap = null
            notifyLiveMap()
          }
          mapRef.current = null
        }
      })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [interactive, onReady, drift, forceDark, forceLight, showControls, syncFriendMarkers])

  return (
    <MapContext.Provider value={{ view }}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-background",
          className
        )}
      >
        {/* Style inline : la CSS non-layered de MapLibre (position:relative
            sur .maplibregl-map) écrase les utilitaires Tailwind en cascade
            layers — on force le positionnement ici. */}
        <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
        {/* Vignette douce pour la profondeur */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(20,26,12,0.14)_100%)]" />
        {pulse && (
          <div
            key={pulse.id}
            className="scan-pulse pointer-events-none absolute h-24 w-24 rounded-full border border-lime-400/70"
            style={{ left: pulse.x, top: pulse.y }}
          />
        )}
      </div>
    </MapContext.Provider>
  )
}

/** Dessine la route sélectionnée dans la source GeoJSON dédiée. */
function syncSelection(map: MapLibreMap, selected: SelectedRoute | null) {
  if (!map.getLayer("route-selected")) return
  const source = map.getSource("selection")
  if (!source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(
    selected
      ? { type: "FeatureCollection", features: [selected.feature] }
      : EMPTY_FC
  )
}
