import type { components } from "@/lib/api-schema"

export type TrafficCollection =
  components["schemas"]["TrafficFeatureCollection"]
export type Quartier = components["schemas"]["QuartierView"]

export async function getTraffic(
  signal?: AbortSignal,
): Promise<{ data: TrafficCollection; partial: boolean }> {
  const res = await fetch("/api/proxy/traffic", { cache: "no-store", signal })
  if (!res.ok) throw new Error(`traffic ${res.status}`)
  const data = (await res.json()) as TrafficCollection
  return { data, partial: res.headers.get("X-Predicta-Partial") === "true" }
}

export async function searchQuartiers(
  q: string,
  signal?: AbortSignal,
): Promise<Quartier[]> {
  const res = await fetch(
    `/api/proxy/quartiers?q=${encodeURIComponent(q)}`,
    { cache: "no-store", signal },
  )
  if (!res.ok) throw new Error(`quartiers ${res.status}`)
  return (await res.json()) as Quartier[]
}
