/**
 * Journal d'activité Predicta — trace chaque début/fin de processus clé
 * (carte, moteur trafic, tuiles) dans la console du navigateur.
 *
 * - Actif en dev ; en prod uniquement si NEXT_PUBLIC_PREDICTA_LOG="true".
 * - Un tag = un acteur, une couleur = identification à l'œil.
 * - Les erreurs s'affichent même journal coupé : ce sont elles qu'on surveille.
 * - Horodatage relatif (+ms depuis le début de session) pour relire un parcours.
 */

const ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_PREDICTA_LOG === "true"

const COLORS: Record<string, string> = {
  map: "#0ea5e9",
  tile: "#8b5cf6",
  trafic: "#f59e0b",
  cache: "#10b981",
  api: "#ef4444",
  error: "#ef4444",
}

const startedAt = Date.now()

function colorOf(tag: string): string {
  return COLORS[tag] ?? "#64748b"
}

/** Ligne d'activité [predicta:tag] avec horodatage relatif. */
export function log(tag: string, message: string, ...rest: unknown[]): void {
  if (!ENABLED) return
  const elapsed = (Date.now() - startedAt).toFixed(0).padStart(5, " ")
  console.info(
    `%c[predicta:${tag}] %c+${elapsed}ms %c${message}`,
    `color:${colorOf(tag)};font-weight:600`,
    "color:#94a3b8",
    "color:inherit",
    ...rest
  )
}

export function warn(tag: string, message: string, ...rest: unknown[]): void {
  if (!ENABLED) return
  console.warn(`[predicta:${tag}] ${message}`, ...rest)
}

/** Erreur : affichée même journal coupé. */
export function error(tag: string, message: string, ...rest: unknown[]): void {
  console.error(`[predicta:${tag}] ${message}`, ...rest)
}

/**
 * Chrono : log « message » puis, à la clôture, « message -> résultat (X ms) ».
 * Résultat optionnel : passer l'échec pour fermer proprement les branches.
 */
export function step(tag: string, message: string): (result?: string) => void {
  log(tag, message)
  const start = performance.now()
  return (result?: string) => {
    const ms = Math.round(performance.now() - start)
    log(tag, result ? `${message} -> ${result} (${ms} ms)` : `${message} (${ms} ms)`)
  }
}