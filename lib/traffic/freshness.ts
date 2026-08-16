import type { TrafficMeta } from "@/lib/types/traffic"

export type FreshnessKind = "live" | "cached" | "partial" | "fallback"

export interface Freshness {
  kind: FreshnessKind
  /** Horodatage local de la dernière réception de données. */
  fetchedAt: number
  /** Âge serveur (ms) si servi depuis le cache (X-Predicta-Age), sinon null. */
  ageMs: number | null
  /** Source qui a fourni les données ("Analakely", "Zone", "Ville entière"). */
  sourceLabel: string
}

export function freshnessFromMeta(
  meta: TrafficMeta,
  sourceLabel: string
): Freshness {
  const partial = meta.partial || meta.fallback
  const kind: FreshnessKind = partial
    ? meta.fallback
      ? "fallback"
      : "partial"
    : meta.ageMs !== null
      ? "cached"
      : "live"
  return {
    kind,
    fetchedAt: meta.fetchedAt,
    ageMs: meta.ageMs,
    sourceLabel,
  }
}

/** Ligne principale, typographique : "Trafic actualisé il y a 14 s". */
export function freshnessLine(f: Freshness, now: number): string {
  const age = Math.max(0, now - f.fetchedAt)
  if (age < 2000) return "Trafic actualisé à l'instant"
  const s = Math.round(age / 1000)
  if (s < 60) return `Trafic actualisé il y a ${s} s`
  const m = Math.floor(s / 60)
  return `Trafic actualisé il y a ${m} min`
}

/** Ligne secondaire (état partiel / fallback), ou null. */
export function freshnessDetail(f: Freshness): string | null {
  if (f.kind === "partial") {
    return "Certaines routes manquent en ce moment."
  }
  if (f.kind === "fallback") {
    return "Données élargies autour du quartier."
  }
  return null
}
