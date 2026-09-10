/**
 * Une position partagée plus vieille que ce délai est considérée comme
 * périmée (masquée aux amis). Unique source de vérité, partagée entre les
 * actions (mise à jour/lecture de position) et les notifications.
 */
export const LOCATION_TTL_MS = 5 * 60_000

/**
 * Cadence de publication de la position pendant un partage actif (côté
 * watcher navigateur). Distinct du TTL, qui lui évalue la fraîcheur.
 */
export const SHARE_INTERVAL_MS = 30_000