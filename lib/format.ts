/** Formatage des valeurs trafic — français, typographie soignée. */

export function formatSpeed(speed: number | undefined): string {
  if (typeof speed !== "number" || !Number.isFinite(speed)) return "—"
  return `${Math.round(speed)}`
}

export function formatRate(rate: number | undefined): string {
  if (typeof rate !== "number" || !Number.isFinite(rate)) return "—"
  return rate.toFixed(2)
}

export type Congestion = "fluide" | "modéré" | "dense" | "indisponible"

/** Niveau de congestion depuis le ratio vitesse observée / vitesse libre. */
export function congestionLevel(rate: number | undefined): Congestion {
  if (typeof rate !== "number" || !Number.isFinite(rate)) return "indisponible"
  if (rate >= 0.75) return "fluide"
  if (rate >= 0.5) return "modéré"
  return "dense"
}

export function congestionLabel(rate: number | undefined): string {
  switch (congestionLevel(rate)) {
    case "fluide":
      return "Circulation fluide"
    case "modéré":
      return "Trafic modéré"
    case "dense":
      return "Trafic dense"
    case "indisponible":
      return "Données indisponibles"
  }
}

/** Temps relatif : "à l'instant", "il y a 12 s", "il y a 3 min". */
export function formatRelativeTime(ms: number): string {
  if (ms < 2000) return "à l'instant"
  const s = Math.round(ms / 1000)
  if (s < 60) return `il y a ${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  return `il y a ${h} h`
}

/** Compteur vivant : 12 s, 13 s, 14 s… */
export function formatSeconds(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${s} s`
}

export function formatCoordinates(lon: number, lat: number): string {
  const ns = lat >= 0 ? "N" : "S"
  const ew = lon >= 0 ? "E" : "O"
  return `${Math.abs(lat).toFixed(4)}° ${ns} · ${Math.abs(lon).toFixed(4)}° ${ew}`
}
