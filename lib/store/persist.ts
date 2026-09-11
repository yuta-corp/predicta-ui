/**
 * Accès sûr à l'API `persist` de zustand.
 *
 * Quand le stockage est indisponible (rendu serveur : pas de `localStorage` ;
 * navigateur qui bloque le stockage), zustand n'installe **pas** `store.persist`.
 * Y accéder aveuglément fait planter le rendu serveur : on valide donc la forme
 * de l'API avant de l'utiliser.
 */

export interface PersistApi {
  hasHydrated: () => boolean
  onFinishHydration: (callback: () => void) => () => void
  rehydrate: () => Promise<void> | void
}

function isPersistApi(value: unknown): value is PersistApi {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Partial<PersistApi>
  return (
    typeof candidate.hasHydrated === "function" &&
    typeof candidate.onFinishHydration === "function" &&
    typeof candidate.rehydrate === "function"
  )
}

/** Renvoie l'API de persistance d'un store, ou null si elle n'existe pas. */
export function getPersistApi(store: unknown): PersistApi | null {
  if (typeof store !== "object" || store === null) return null
  const api = (store as { persist?: unknown }).persist
  return isPersistApi(api) ? api : null
}
