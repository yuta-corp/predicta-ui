import type { PositionFix } from "@/lib/map/position-filter"

/**
 * Choisit le fix à publier parmi les derniers reçus.
 *
 * Un capteur GPS rend des fixes de précision inégale (multipath en ville, fix
 * réseau avant le verrouillage satellite). Publier « le plus récent » expose
 * donc parfois une position à plusieurs centaines de mètres, alors qu'un fix
 * plus précis datant de quelques secondes décrit mieux la position. On retient
 * le fix le plus précis de la fenêtre ; à précision égale, le plus récent.
 * La fenêtre borne la fraîcheur perdue : au-delà, la position est trop vieille
 * pour valoir mieux que le dernier fix connu.
 *
 * Fonction pure, sans allocation dépendante des données : la boucle est bornée
 * par la taille du tableau reçu (tampon borné côté session de partage).
 */
export function selectPreciseFix(
  fixes: readonly PositionFix[],
  nowMs: number,
  windowMs: number
): PositionFix | null {
  if (!Number.isFinite(nowMs) || !Number.isFinite(windowMs) || windowMs <= 0) {
    return null
  }

  let best: PositionFix | null = null
  for (const fix of fixes) {
    if (!isUsableFix(fix)) continue
    if (nowMs - fix.timestamp > windowMs) continue
    if (best === null || fix.accuracy <= best.accuracy) best = fix
  }
  return best
}

/** Un fix exploitable : coordonnées finies et précision connue, positive. */
export function isUsableFix(fix: PositionFix): boolean {
  return (
    Number.isFinite(fix.latitude) &&
    Number.isFinite(fix.longitude) &&
    Number.isFinite(fix.accuracy) &&
    fix.accuracy >= 0
  )
}
