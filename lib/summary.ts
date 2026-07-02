import type { TrafficCollection } from "@/lib/api"

export function computeLiveSummary(data: TrafficCollection | null): {
  avgSpeed: number | null
  pctCongested: number | null
  total: number
} {
  if (!data || data.features.length === 0) {
    return { avgSpeed: null, pctCongested: null, total: 0 }
  }
  let sum = 0
  let n = 0
  let congested = 0
  for (const f of data.features) {
    const speed = f.properties?.speed
    const rate = f.properties?.rate
    if (typeof speed === "number") {
      sum += speed
      n++
    }
    if (typeof rate === "number" && rate < 0.5) congested++
  }
  return {
    avgSpeed: n ? Math.round(sum / n) : null,
    pctCongested: Math.round((congested / data.features.length) * 100),
    total: data.features.length,
  }
}
