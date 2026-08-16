import type { TrafficFeature, TrafficMeta } from "@/lib/types/traffic"
import { featureKey } from "@/lib/geo"

/** Origine d'un jeu de features, pour fusion/déduplication et refresh SWR. */
export type TrafficTag =
  | { kind: "quartier"; id: string }
  | { kind: "zone"; cell: string }
  | { kind: "city" }

export function tagKey(tag: TrafficTag): string {
  if (tag.kind === "quartier") return `q:${tag.id}`
  if (tag.kind === "zone") return `z:${tag.cell}`
  return "city"
}

export interface StoredSource {
  key: string
  tag: TrafficTag
  /** Libellé lisible ("Analakely", "Zone 47.5:-18.9", "Ville entière"). */
  label: string
  features: TrafficFeature[]
  meta: TrafficMeta
  fetchedAt: number
}

export interface StoreUpdate {
  /** Nouvelles features (non dupliquées avec ce qui était déjà chargé). */
  added: TrafficFeature[]
  /** Features d'une même source mises à jour en place (refresh SWR). */
  updated: TrafficFeature[]
  /** Nombre de features retirées (géométries disparues d'une source). */
  removed: number
  total: number
  source: StoredSource
}

/**
 * Registre central des features trafic, taggé par source.
 *
 * Fusion par clé de géométrie : un segment déjà présent (couvert par un
 * autre quartier ou par la zone) n'est pas dupliqué. Un refresh d'une même
 * source met à jour ses features EN PLACE (les géométries reviennent
 * identiques, seules les valeurs changent) — la carte peut rafraîchir sans
 * reconstruire tout le GeoJSON.
 */
export class TrafficStore {
  private byKey = new Map<string, { feature: TrafficFeature; sourceKey: string }>()
  private sources = new Map<string, StoredSource>()
  private listeners = new Set<() => void>()
  private revision = 0
  lastUpdate: StoreUpdate | null = null

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private notify() {
    for (const fn of this.listeners) fn()
  }

  getSource(key: string): StoredSource | undefined {
    return this.sources.get(key)
  }

  listSources(): StoredSource[] {
    return [...this.sources.values()]
  }

  get total(): number {
    return this.byKey.size
  }

  /**
   * Ajoute ou remplace une source. Renvoie le diff pour un rendu
   * incrémental (construction progressive de la ville) sans recharger
   * toute la donnée.
   */
  upsert(source: StoredSource): StoreUpdate {
    const previous = this.sources.get(source.key)
    const newKeys = new Set(source.features.map(featureKey))
    let removed = 0
    const added: TrafficFeature[] = []
    const updated: TrafficFeature[] = []

    // Géométries de l'ancienne version absentes de la nouvelle : retrait.
    if (previous) {
      for (const f of previous.features) {
        const k = featureKey(f)
        if (newKeys.has(k)) continue
        const entry = this.byKey.get(k)
        if (entry && entry.sourceKey === source.key) {
          this.byKey.delete(k)
          removed++
        }
      }
    }

    // Ajout, mise à jour en place, ou simple recouvrement par une autre source.
    const seen = new Set<string>()
    for (const f of source.features) {
      const k = featureKey(f)
      if (seen.has(k)) continue
      seen.add(k)
      const existing = this.byKey.get(k)
      if (existing && existing.sourceKey === source.key) {
        existing.feature = f
        updated.push(f)
      } else if (existing) {
        // Déjà couvert par une autre source (quartier ⊆ zone par ex.).
      } else {
        this.byKey.set(k, { feature: f, sourceKey: source.key })
        added.push(f)
      }
    }

    this.sources.set(source.key, source)
    this.revision++
    this.lastUpdate = { added, updated, removed, total: this.byKey.size, source }
    this.notify()
    return this.lastUpdate
  }

  /** Features fusionnées, dans l'ordre d'insertion. */
  allFeatures(): TrafficFeature[] {
    const out: TrafficFeature[] = []
    for (const entry of this.byKey.values()) out.push(entry.feature)
    return out
  }

  lookupByKey(key: string): { feature: TrafficFeature; sourceKey: string } | undefined {
    return this.byKey.get(key)
  }
}
