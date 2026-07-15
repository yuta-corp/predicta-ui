import type { components } from "@/lib/api-schema"

export type TrafficCollection =
  components["schemas"]["TrafficFeatureCollection"]

export async function getTraffic(
  signal?: AbortSignal,
): Promise<{ data: TrafficCollection; partial: boolean }> {
  const res = await fetch("/api/proxy/traffic", { cache: "no-store", signal })
  if (!res.ok) throw new Error(`traffic ${res.status}`)
  const data = (await res.json()) as TrafficCollection
  return { data, partial: res.headers.get("X-Predicta-Partial") === "true" }
}
