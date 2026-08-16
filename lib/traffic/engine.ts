import {
  fetchQuartierTraffic,
  fetchZoneTraffic,
} from "@/lib/api/client"
import type {
  Quartier,
  TrafficFeature,
  TrafficMeta,
} from "@/lib/types/traffic"
import { quartiersById } from "@/lib/data/quartiers"
import {
  bboxOfFeature,
  featureKey,
  gridCellKey,
  nearestQuartier,
  TANA_CENTER,
} from "@/lib/geo"
import {
  freshnessFromMeta,
  type Freshness,
} from "@/lib/traffic/freshness"
import { TrafficStore, tagKey } from "@/lib/traffic/store"

export interface EngineState {
  version: number
  /** Une requête est en cours (hors refresh SWR silencieux). */
  busy: boolean
  freshness: Freshness | null
  selected: SelectedRoute | null
  /** Demande de mouvement caméra (consommée par la carte). */
  focus: CameraFocus | null
  /** Impulsion visuelle d'un scan (consommée par la carte). */
  scan: ScanPulse | null
  activeQuartier: Quartier | null
  error: string | null
  cityReveal: { loaded: number; total: number } | null
  counts: { routes: number; sources: number }
  /** Trace de la dernière requête trafic (explorateur développeur). */
  lastRequest: LastRequest | null
}

export interface LastRequest {
  method: "GET" | "PUT"
  path: string
  status: number
  durationMs: number
  features: number
  meta: TrafficMeta | null
  error: boolean
}

export interface SelectedRoute {
  id: string
  feature: TrafficFeature
  sourceKey: string
  label: string
  quartierName: string | null
}

export type CameraFocus =
  | { id: number; type: "point"; lon: number; lat: number; zoom: number }
  | { id: number; type: "bbox"; bbox: [number, number, number, number] }

export interface ScanPulse {
  id: number
  lon: number
  lat: number
  label: string
}

const SWR_INTERVAL_MS = 45_000
const ZONE_COOLDOWN_MS = 90_000

interface ZoneCacheEntry {
  fetchedAt: number
  meta: TrafficMeta
  /** Bbox [west, south, east, north] de la réponse zone. */
  extent: [number, number, number, number]
  sourceKey: string
}

class TrafficEngine {
  readonly store = new TrafficStore()

  private state: EngineState = {
    version: 0,
    busy: false,
    freshness: null,
    selected: null,
    focus: null,
    scan: null,
    activeQuartier: null,
    error: null,
    cityReveal: null,
    counts: { routes: 0, sources: 0 },
    lastRequest: null,
  }

  private listeners = new Set<() => void>()
  private focusId = 0
  private scanId = 0
  private inFlight = new Set<string>()
  private zoneCache: ZoneCacheEntry | null = null
  private swrTimer: ReturnType<typeof setInterval> | null = null
  private swrInFlight = false

  getSnapshot(): EngineState {
    return this.state
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    if (!this.swrTimer) {
      this.swrTimer = setInterval(() => {
        void this.silentRefresh()
      }, SWR_INTERVAL_MS)
    }
    return () => {
      this.listeners.delete(fn)
      if (this.listeners.size === 0 && this.swrTimer) {
        clearInterval(this.swrTimer)
        this.swrTimer = null
      }
    }
  }

  private setState(patch: Partial<EngineState>) {
    this.state = { ...this.state, ...patch, version: this.state.version + 1 }
    for (const fn of this.listeners) fn()
  }

  /** Sélectionne un quartier : recentrage + chargement de son trafic. */
  selectQuartier(q: Quartier) {
    this.setState({
      activeQuartier: q,
      error: null,
      focus: {
        id: ++this.focusId,
        type: "point",
        lon: q.lon,
        lat: q.lat,
        zoom: 14.5,
      },
    })
    void this.loadQuartier(q)
  }

  /** Charge le trafic d'un quartier (endpoint le plus utilisé). */
  async loadQuartier(q: Quartier): Promise<void> {
    const key = tagKey({ kind: "quartier", id: q.id })
    if (this.inFlight.has(key)) return
    this.inFlight.add(key)
    this.setState({ busy: true, error: null })
    const startedAt = performance.now()
    try {
      const { data, meta } = await fetchQuartierTraffic(q.id)
      const update = this.store.upsert({
        key,
        tag: { kind: "quartier", id: q.id },
        label: q.name,
        features: data.features,
        meta,
        fetchedAt: meta.fetchedAt,
      })
      this.setState({
        busy: false,
        freshness: freshnessFromMeta(meta, q.name),
        counts: { routes: update.total, sources: this.store.listSources().length },
        lastRequest: {
          method: "GET",
          path: `/traffic/quartier/${q.id}`,
          status: 200,
          durationMs: Math.round(performance.now() - startedAt),
          features: data.features.length,
          meta,
          error: false,
        },
      })
    } catch (error) {
      this.setState({
        busy: false,
        error: error instanceof Error ? error.message : "Chargement impossible.",
      })
    } finally {
      this.inFlight.delete(key)
    }
  }

  /**
   * Scan d'un point (clic carte) : impulsion visuelle puis trafic autour.
   * La réponse zone couvre un large périmètre : on la met en cache et on
   * la réutilise tant que le point est dans son étendue (cooldown).
   */
  async scanPoint(lon: number, lat: number): Promise<void> {
    const cell = gridCellKey(lon, lat)
    const quartier = nearestQuartier(lon, lat)
    const label = quartier ? quartier.name : `Point ${lon.toFixed(3)}, ${lat.toFixed(3)}`
    this.setState({ scan: { id: ++this.scanId, lon, lat, label } })

    if (this.zoneCache) {
      const [w, s, e, n] = this.zoneCache.extent
      const withinExtent = lon >= w && lon <= e && lat >= s && lat <= n
      const fresh = Date.now() - this.zoneCache.fetchedAt < ZONE_COOLDOWN_MS
      if (withinExtent && fresh) {
        this.setState({
          activeQuartier: quartier,
          error: null,
          focus: { id: ++this.focusId, type: "point", lon, lat, zoom: 13.5 },
        })
        return
      }
    }

    const key = tagKey({ kind: "zone", cell })
    if (this.inFlight.has(key)) return
    this.inFlight.add(key)
    this.setState({ busy: true, error: null })
    const startedAt = performance.now()
    try {
      const { data, meta } = await fetchZoneTraffic({
        name: quartier ? quartier.name : label,
        lon,
        lat,
      })
      const update = this.store.upsert({
        key,
        tag: { kind: "zone", cell },
        label: quartier ? `Zone ${quartier.name}` : "Zone",
        features: data.features,
        meta,
        fetchedAt: meta.fetchedAt,
      })
      this.zoneCache = {
        fetchedAt: meta.fetchedAt,
        meta,
        extent: extentOf(data.features),
        sourceKey: key,
      }
      this.setState({
        busy: false,
        activeQuartier: quartier,
        freshness: freshnessFromMeta(meta, quartier ? quartier.name : "Zone"),
        counts: { routes: update.total, sources: this.store.listSources().length },
        focus: { id: ++this.focusId, type: "point", lon, lat, zoom: 13.5 },
        lastRequest: {
          method: "PUT",
          path: "/traffic/zone",
          status: 200,
          durationMs: Math.round(performance.now() - startedAt),
          features: data.features.length,
          meta,
          error: false,
        },
      })
    } catch (error) {
      this.setState({
        busy: false,
        error: error instanceof Error ? error.message : "Scan impossible.",
      })
    } finally {
      this.inFlight.delete(key)
    }
  }

  /**
   * Construction progressive de la ville — neutralisée : depuis le passage aux
   * tuiles MVT (technique tag-ip), la ville apparaît directement, le chargement
   * quartier par quartier n'a plus de rôle visuel. Garde l'état pour le chrome
   * (landing) sans déclencher les ~48 fetches GeoJSON.
   */
  async revealCity(): Promise<void> {
    if (this.state.cityReveal) return
    this.setState({ cityReveal: { loaded: 0, total: 0 } })
  }

  /** Sélection d'une route sur la carte (feature rendu). */
  selectRoute(feature: TrafficFeature) {
    // Le feature rendu (queryRenderedFeatures) porte une géométrie quantisée
    // par la tuile : sa clé ne matche pas le store. On résout la feature
    // originale la plus proche pour retrouver source et quartier.
    const resolved = this.resolveStoredFeature(feature)
    const target = resolved ?? feature
    const id = featureKey(target)
    const entry = this.store.lookupByKey(id)
    const source = entry ? this.store.getSource(entry.sourceKey) : null
    const bbox = bboxOfFeature(target)
    // L'API ne fournit pas properties.quartierId en pratique : on reverse-
    // geocode le centroïde de la route vers le quartier le plus proche
    // (l'index local des 372 quartiers, zéro requête).
    const quartierId = target.properties.quartierId
    const quartier =
      (quartierId ? quartiersById[quartierId] : undefined) ??
      nearestQuartier((bbox.west + bbox.east) / 2, (bbox.south + bbox.north) / 2)
    this.setState({
      selected: {
        id,
        feature: target,
        sourceKey: entry?.sourceKey ?? "",
        label: source?.label ?? "",
        quartierName: quartier?.name ?? null,
      },
      focus: {
        id: ++this.focusId,
        type: "bbox",
        bbox: [bbox.west, bbox.south, bbox.east, bbox.north],
      },
    })
  }

  /**
   * Retrouve dans le store la feature dont la géométrie est la plus proche
   * du feature rendu (quantisation tuile ≈ quelques mètres). Le segment
   * original partage un sommet avec son rendu : le plus proche suffit.
   */
  private resolveStoredFeature(
    rendered: TrafficFeature
  ): TrafficFeature | undefined {
    const g = rendered.geometry
    const anchor =
      g.type === "LineString" ? g.coordinates[0] : g.coordinates[0][0]
    if (!anchor) return undefined
    const [lon, lat] = anchor
    // Tolérance généreuse autour du point (≈ 25 m) pour couvrir l'erreur
    // de quantisation + la densité des segments adjacents.
    const tol = 0.00025
    let best: TrafficFeature | undefined
    let bestD = Infinity
    for (const f of this.store.allFeatures()) {
      const c = f.geometry
      const coords =
        c.type === "LineString" ? c.coordinates : c.coordinates.flat()
      for (const [x, y] of coords) {
        if (Math.abs(x - lon) > tol || Math.abs(y - lat) > tol) continue
        const d = Math.hypot(x - lon, y - lat)
        if (d < bestD) {
          bestD = d
          best = f
        }
      }
    }
    return bestD < 0.00002 ? best : undefined
  }

  clearSelection() {
    this.setState({ selected: null })
  }

  /**
   * Nouvelle session de carte : on repart d'une ville vierge — zéro
   * sélection, zéro focus caméra, zéro scan, zéro requête affichée.
   * Appelé à la création d'une instance CityMap : la carte de /map (ou de
   * n'importe quelle page) ne dépend jamais de l'exploration faite sur la
   * landing. Le cache (store) est conservé : c'est un cache, pas un état.
   */
  resetExploration() {
    this.setState({
      selected: null,
      activeQuartier: null,
      focus: null,
      scan: null,
      error: null,
      freshness: null,
      cityReveal: null,
      lastRequest: null,
    })
  }

  retry() {
    const active = this.state.activeQuartier
    if (active) {
      void this.loadQuartier(active)
    } else {
      void this.scanPoint(TANA_CENTER[0], TANA_CENTER[1])
    }
  }

  /** Refresh SWR silencieux du quartier actif (garder l'ancienne donnée). */
  private async silentRefresh(): Promise<void> {
    const active = this.state.activeQuartier
    if (!active || this.swrInFlight || this.inFlight.size > 0) return
    if (Date.now() - (this.state.freshness?.fetchedAt ?? 0) < 15_000) return
    this.swrInFlight = true
    try {
      const { data, meta } = await fetchQuartierTraffic(active.id)
      this.store.upsert({
        key: tagKey({ kind: "quartier", id: active.id }),
        tag: { kind: "quartier", id: active.id },
        label: active.name,
        features: data.features,
        meta,
        fetchedAt: meta.fetchedAt,
      })
      this.setState({ freshness: freshnessFromMeta(meta, active.name) })
    } catch {
      // Refresh silencieux : on garde l'ancienne donnée, pas d'erreur affichée.
    } finally {
      this.swrInFlight = false
    }
  }
}

function extentOf(features: TrafficFeature[]): [number, number, number, number] {
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
  return [west, south, east, north]
}

/** Singleton partagé : survit à la navigation, un seul timer SWR. */
export const trafficEngine = new TrafficEngine()
