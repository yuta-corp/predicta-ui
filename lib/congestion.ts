export type Bucket = "fluide" | "moyen" | "lent" | "bloque" | "inconnu"

export function congestionBucket(rate: number | undefined): Bucket {
  if (rate == null || Number.isNaN(rate)) return "inconnu"
  if (rate >= 0.75) return "fluide"
  if (rate >= 0.5) return "moyen"
  if (rate >= 0.25) return "lent"
  return "bloque"
}

export const BUCKET_COLOR: Record<Bucket, string> = {
  fluide: "#C1FF72",
  moyen: "#9FCA69",
  lent: "#5B6650",
  bloque: "#0A0A0A",
  inconnu: "#3A3F34",
}

export const BUCKET_LABEL: Record<Bucket, string> = {
  fluide: "Fluide",
  moyen: "Moyen",
  lent: "Lent",
  bloque: "Bloqué",
  inconnu: "Inconnu",
}
