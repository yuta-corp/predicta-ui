/**
 * Runtime de la carte de ville : création de l'instance MapLibre et câblage des
 * interactions (thème, dérive, moteur de trafic, survol, tuiles). Chaque
 * fonction fait une seule chose et renvoie sa fonction d'arrêt, pour que le
 * composant carte n'ait plus qu'à orchestrer.
 */

import {
  Map as MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapMouseEvent,
  type StyleSpecification,
} from "maplibre-gl"

import {
  EMPTY_FEATURE_COLLECTION,
  TILE_LAYERS,
  TILE_REFRESH_MS,
  fallbackStyle,
  loadPredictaStyle,
} from "@/lib/map/city-style"
import { TANA_CENTER, featureKey } from "@/lib/geo"
import { quartiersByLowerName } from "@/lib/data/quartiers"
import { clearLiveMap, setLiveMap } from "@/lib/map/map-registry"
import { useMapFocusStore } from "@/lib/store/map-focus"
import { trafficEngine, type SelectedRoute } from "@/lib/traffic/engine"
import type { TrafficFeature } from "@/lib/types/traffic"

declare global {
  interface Window {
    __predictaMap?: MapLibreMap
    __predictaEngine?: typeof import("@/lib/traffic/engine").trafficEngine
  }
}

/** Vue courante de la carte (lue par le chrome de l'interface). */
export interface MapView {
  lon: number
  lat: number
  zoom: number
}

/** Un scan de la carte : identifiant et position écran du pulse. */
export interface MapPulse {
  id: number
  x: number
  y: number
}

/** Thème courant du document, verrouillé par forceDark / forceLight. */
export function isDarkDocument(forceDark: boolean, forceLight: boolean): boolean {
  if (forceDark) return true
  if (forceLight) return false
  return document.documentElement.classList.contains("dark")
}

/**
 * Applique les liens profonds de l'URL à la session vierge : `/map?q=Analakely`
 * (recherche de la landing) et `/map?friend=<id>` (notification « a partagé sa
 * position »). Une session vierge évite que la sélection ou la caméra de la
 * page précédente ne fuient ici.
 */
function applyDeepLinks(): void {
  trafficEngine.resetExploration()

  const params = new URLSearchParams(window.location.search)
  const quartierName = params.get("q")
  if (quartierName) {
    const quartier = quartiersByLowerName[quartierName.trim().toLowerCase()]
    if (quartier) trafficEngine.selectQuartier(quartier)
  }

  const friendId = params.get("friend")
  if (friendId) useMapFocusStore.getState().focusFriend(friendId)
}

/** Charge le style fusionné, avec fond de secours si OpenFreeMap est injoignable. */
async function resolveStyle(isDark: boolean) {
  try {
    return await loadPredictaStyle(isDark)
  } catch (error) {
    console.error("Basemap OpenFreeMap indisponible — fond de secours.", error)
    return fallbackStyle(isDark)
  }
}

/**
 * Crée l'instance MapLibre. En mode décor (`interactive: false`), toute
 * interaction est coupée : la carte n'est qu'un fond.
 */
function createMapInstance(
  container: HTMLDivElement,
  style: Awaited<ReturnType<typeof resolveStyle>>,
  interactive: boolean
): MapLibreMap {
  const map = new MapLibreMap({
    container,
    style,
    center: [TANA_CENTER[0], TANA_CENTER[1]],
    zoom: 12.2,
    minZoom: 2,
    maxZoom: 17,
    attributionControl: false,
    dragRotate: true,
    pitchWithRotate: false,
    fadeDuration: 120,
  })

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

  return map
}

/** Dessine la route sélectionnée dans la source GeoJSON dédiée. */
export function syncSelection(map: MapLibreMap, selected: SelectedRoute | null): void {
  if (!map.getLayer("route-selected")) return
  const source = map.getSource("selection")
  if (!source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(
    selected
      ? { type: "FeatureCollection", features: [selected.feature] }
      : EMPTY_FEATURE_COLLECTION
  )
}

/** Dessine (ou efface) la route survolée dans la source dédiée. */
function syncHover(
  map: MapLibreMap,
  previous: TrafficFeature | null,
  next: TrafficFeature | null
): void {
  const prevKey = previous ? featureKey(previous) : null
  const nextKey = next ? featureKey(next) : null
  if (prevKey === nextKey) return
  const source = map.getSource("hover")
  if (!map.getLayer("route-hover") || !source || source.type !== "geojson") return
  ;(source as GeoJSONSource).setData(
    next ? { type: "FeatureCollection", features: [next] } : EMPTY_FEATURE_COLLECTION
  )
}

/** Refresh périodique des tuiles (revalidation ETag → 304). */
export function attachTileRefresh(map: MapLibreMap): () => void {
  const timer = setInterval(() => {
    if (map.getSource("traffic")) map.refreshTiles("traffic")
  }, TILE_REFRESH_MS)
  return () => clearInterval(timer)
}

/** Le basemap suit le clair/sombre du document (verrouillé si force*). */
export function attachThemeSync(
  map: MapLibreMap,
  forceDark: boolean,
  forceLight: boolean
): () => void {
  const observer = new MutationObserver(() => {
    if (forceDark || forceLight) return
    const isDark = isDarkDocument(forceDark, forceLight)
    void resolveStyle(isDark).then((next) => {
      if (map.isStyleLoaded()) map.setStyle(next)
    })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

/**
 * Dérive lente de la caméra (héros de la landing) : Lissajous autour du centre
 * de Tana, pause de 8 s après toute interaction.
 */
export function attachDrift(map: MapLibreMap): () => void {
  let lastInteraction = 0
  const markInteraction = () => {
    lastInteraction = Date.now()
  }
  map.on("mousedown", markInteraction)
  map.on("wheel", markInteraction)
  map.on("touchstart", markInteraction)
  map.on("dragstart", markInteraction)

  const timer = setInterval(() => {
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

  return () => {
    clearInterval(timer)
    map.off("mousedown", markInteraction)
    map.off("wheel", markInteraction)
    map.off("touchstart", markInteraction)
    map.off("dragstart", markInteraction)
  }
}

/**
 * Relie la carte au moteur de trafic : la caméra suit le focus, un scan affiche
 * son pulse, la sélection se dessine. Renvoie la fonction de désabonnement.
 */
export function attachEngineBridge(
  map: MapLibreMap,
  reducedMotion: boolean,
  onPulse: (pulse: MapPulse) => void
): () => void {
  let lastFocusId = 0

  const applyEngine = () => {
    const state = trafficEngine.getSnapshot()

    const focus = state.focus
    if (focus && focus.id !== lastFocusId) {
      lastFocusId = focus.id
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
      const point = map.project([scan.lon, scan.lat])
      onPulse({ id: scan.id, x: point.x, y: point.y })
    }

    syncSelection(map, state.selected)
  }

  const unsubscribe = trafficEngine.subscribe(applyEngine)
  applyEngine()
  return unsubscribe
}

/** Clic : une route se sélectionne, le vide déclenche un scan. */
function attachClickHandler(map: MapLibreMap, interactive: boolean): () => void {
  const onClick = (event: MapMouseEvent) => {
    if (!interactive) return
    const { x, y } = event.point
    const hits = map.queryRenderedFeatures(
      [
        [x - 6, y - 6],
        [x + 6, y + 6],
      ],
      { layers: [...TILE_LAYERS] }
    )
    const hit = hits[0] as TrafficFeature | undefined
    if (hit) trafficEngine.selectRoute(hit)
    else trafficEngine.scanPoint(event.lngLat.lng, event.lngLat.lat)
  }
  map.on("click", onClick)
  return () => map.off("click", onClick)
}

/**
 * Survol : le curseur devient une main au-dessus d'une route et la route
 * survolée se détache doucement du réseau. Le travail lourd est limité à une
 * image par rafraîchissement (requestAnimationFrame).
 */
function attachHoverHandler(map: MapLibreMap, interactive: boolean): () => void {
  let hovered: TrafficFeature | null = null
  let cursorFrame = 0

  const onMouseMove = (event: MapMouseEvent) => {
    cancelAnimationFrame(cursorFrame)
    cursorFrame = requestAnimationFrame(() => {
      if (!interactive) return
      const hits = map.queryRenderedFeatures(
        [
          [event.point.x - 3, event.point.y - 3],
          [event.point.x + 3, event.point.y + 3],
        ],
        { layers: [...TILE_LAYERS] }
      )
      map.getCanvas().style.cursor = hits.length > 0 ? "pointer" : ""
      const hit = (hits[0] ?? null) as TrafficFeature | null
      syncHover(map, hovered, hit)
      hovered = hit
    })
  }

  const canvas = map.getCanvas()
  const onMouseLeave = () => {
    cancelAnimationFrame(cursorFrame)
    syncHover(map, hovered, null)
    hovered = null
  }

  map.on("mousemove", onMouseMove)
  canvas.addEventListener("mouseleave", onMouseLeave)
  return () => {
    cancelAnimationFrame(cursorFrame)
    map.off("mousemove", onMouseMove)
    canvas.removeEventListener("mouseleave", onMouseLeave)
  }
}

/** Câble clic + survol, et renvoie l'arrêt commun. */
export function attachTrafficInteractions(
  map: MapLibreMap,
  interactive: boolean
): () => void {
  const stopClick = attachClickHandler(map, interactive)
  const stopHover = attachHoverHandler(map, interactive)
  return () => {
    stopClick()
    stopHover()
  }
}

export interface CreateCityMapOptions {
  container: HTMLDivElement
  interactive: boolean
  drift: boolean
  forceDark: boolean
  forceLight: boolean
  showControls: boolean
  onReady?: () => void
  /** Préviant le propriétaire que l'instance existe (pour la garder en ref). */
  onMapCreated: (map: MapLibreMap) => void
  /** Redessine les amis dès que la carte est prête (positions déjà connues). */
  onMapReady: (map: MapLibreMap) => void
  /** Repeint la précision des amis après un changement de style. */
  onStyleLoad: (map: MapLibreMap) => void
  onView: (view: MapView) => void
  onPulse: (pulse: MapPulse) => void
}

const ZOOM_CONTROL_POSITION = "top-right"

/** Prévient la vue après un chargement ou un déplacement de caméra. */
function attachReadyAndView(
  map: MapLibreMap,
  options: CreateCityMapOptions
): () => void {
  const emitView = () => {
    const center = map.getCenter()
    options.onView({ lon: center.lng, lat: center.lat, zoom: map.getZoom() })
  }
  const onLoad = () => {
    syncSelection(map, trafficEngine.getSnapshot().selected)
    options.onReady?.()
    options.onMapReady(map)
    emitView()
  }
  map.on("load", onLoad)
  map.on("moveend", emitView)
  return () => {
    map.off("load", onLoad)
    map.off("moveend", emitView)
  }
}

/** Crée l'instance et câble tout ce qui vit avec elle. Renvoie l'arrêt commun. */
function mountCityMap(
  options: CreateCityMapOptions,
  style: StyleSpecification
): () => void {
  const map = createMapInstance(options.container, style, options.interactive)
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  setLiveMap(map)
  options.onMapCreated(map)
  if (process.env.NODE_ENV !== "production") {
    window.__predictaMap = map
    window.__predictaEngine = trafficEngine
  }

  const zoomControl = new NavigationControl({ showCompass: false })
  if (options.showControls) map.addControl(zoomControl, ZOOM_CONTROL_POSITION)
  const onStyleLoad = () => options.onStyleLoad(map)
  map.on("style.load", onStyleLoad)

  const stops = [
    attachReadyAndView(map, options),
    options.drift && !reducedMotion ? attachDrift(map) : () => {},
    attachThemeSync(map, options.forceDark, options.forceLight),
    attachEngineBridge(map, reducedMotion, options.onPulse),
    attachTrafficInteractions(map, options.interactive),
    attachTileRefresh(map),
  ]

  return () => {
    for (const stop of stops) stop()
    if (options.showControls) map.removeControl(zoomControl)
    map.off("style.load", onStyleLoad)
    clearLiveMap(map)
    map.remove()
  }
}

/**
 * Monte la carte : la carte est créée de façon asynchrone (chargement du
 * style) ; un arrêt demandé avant la fin annule tout.
 */
export function createCityMap(options: CreateCityMapOptions): () => void {
  applyDeepLinks()
  const initialDark = isDarkDocument(options.forceDark, options.forceLight)
  let disposed = false
  let stopAll: (() => void) | null = null

  void resolveStyle(initialDark).then((style) => {
    if (disposed) return
    stopAll = mountCityMap(options, style)
  })

  return () => {
    disposed = true
    stopAll?.()
  }
}
