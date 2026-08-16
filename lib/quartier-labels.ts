import type { QuartierSource } from "@/lib/types/traffic"

export function quartierTypeLabel(source: QuartierSource): string {
  switch (source) {
    case "osm_admin":
      return "Quartier principal"
    case "osm_suburb":
      return "Quartier"
    case "osm_neighbourhood":
      return "Quartier de proximité"
    case "osm_quarter":
      return "Secteur"
    case "osm_locality":
      return "Lieu-dit"
  }
}
