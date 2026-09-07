import { haversineKm } from "@/lib/geo"

export interface PositionFix {
  latitude: number
  longitude: number
  /** Précision en mètres (rayon de confiance) du fix. */
  accuracy: number
  /** Horodatage du fix (ms epoch). */
  timestamp: number
}

export interface PositionFilterOptions {
  /** Déplacement minimal (m) depuis le point affiché avant de le bouger. */
  minMoveM?: number
  /**
   * Un fix au moins `betterAccuracyRatio` fois plus précis que le point
   * affiché le raffine, même sans déplacement suffisant.
   */
  betterAccuracyRatio?: number
  /**
   * Passé ce délai (ms) sans fix plus précis, un fix moins précis est tout
   * de même appliqué — le point ne fige jamais indéfiniment.
   */
  staleAfterMs?: number
}

/**
 * Filtre anti-tremblement des fixes GPS : le point affiché ne bouge qu'en
 * cas de déplacement réel, de raffinement net de la précision, ou de
 * rassissement. Sans cela, les fixes bruts d'un capteur GPS en ville
 * (multipath, GPS domestique) font danser le point de quelques mètres
 * autour de la vraie position.
 */
export function createPositionFilter(options?: PositionFilterOptions) {
  const { minMoveM = 8, betterAccuracyRatio = 0.7, staleAfterMs = 20_000 } =
    options ?? {}

  let displayed: PositionFix | null = null

  return {
    /**
     * Propose le point à dessiner pour ce fix : renvoie la position à
     * afficher (le fix courant, une fois filtré) ou `null` pour conserver
     * le point déjà affiché.
     */
    next(fix: PositionFix): PositionFix | null {
      if (!displayed) {
        displayed = fix
        return fix
      }
      const distM =
        haversineKm(
          [displayed.longitude, displayed.latitude],
          [fix.longitude, fix.latitude]
        ) * 1000
      const movedEnough = distM >= minMoveM
      const notablyBetter =
        fix.accuracy <= displayed.accuracy * betterAccuracyRatio
      const stale = fix.timestamp - displayed.timestamp >= staleAfterMs
      if (movedEnough || notablyBetter || stale) {
        displayed = fix
        return fix
      }
      return null
    },

    /** Oublie le point affiché (nouvelle session de localisation). */
    reset(): void {
      displayed = null
    },
  }
}