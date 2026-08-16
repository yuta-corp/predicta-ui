import type { TrafficFeature } from "@/lib/types/traffic"

export interface JsonRange {
  start: number
  end: number
  feature: TrafficFeature
  index: number
}

export interface JsonDocument {
  lines: string[]
  ranges: JsonRange[]
  capped: boolean
  total: number
}

const indent = (s: string) =>
  s
    .split("\n")
    .map((l) => `    ${l}`)
    .join("\n")

/**
 * Sérialise une FeatureCollection en lignes indexées. Chaque feature est
 * sérialisée indépendamment pour connaître exactement sa plage de lignes :
 * l'explorateur peut ainsi relier une ligne de JSON à une feature (et
 * inversement) sans parsing fragile.
 */
export function buildJsonDocument(
  features: TrafficFeature[],
  cap = 300
): JsonDocument {
  const capped = features.length > cap
  const list = capped ? features.slice(0, cap) : features
  const lines: string[] = ["{", '  "type": "FeatureCollection",', '  "features": [']
  const ranges: JsonRange[] = []

  for (let i = 0; i < list.length; i++) {
    const f = list[i]
    const block = indent(JSON.stringify(f, null, 2)).split("\n")
    if (i < list.length - 1) block[block.length - 1] += ","
    const start = lines.length
    lines.push(...block)
    ranges.push({ start, end: lines.length, feature: f, index: i })
  }

  lines.push("  ]", "}")
  return { lines, ranges, capped, total: features.length }
}

/** Plage contenant une ligne donnée (recherche binaire sur start/end). */
export function rangeAtLine(ranges: JsonRange[], line: number): JsonRange | null {
  let lo = 0
  let hi = ranges.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const r = ranges[mid]
    if (line >= r.start && line < r.end) return r
    if (line < r.start) hi = mid - 1
    else lo = mid + 1
  }
  return null
}
