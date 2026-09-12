/**
 * Messages de géolocalisation, par code `GeolocationPositionError`.
 *
 * Source unique partagée par le contrôle de carte et la session de partage :
 * un code de la spécification → un texte utilisateur, jamais d'erreur brute.
 */

/** `GeolocationPositionError.PERMISSION_DENIED` (valeur de la spécification). */
export const GEOLOCATION_PERMISSION_DENIED = 1

export const GEO_ERROR_MESSAGES: Record<number, string> = {
  [GEOLOCATION_PERMISSION_DENIED]:
    "Localisation refusée. Autorisez l'accès à votre position puis réessayez.",
  2: "Impossible de connaître votre position sur cet appareil.",
  3: "Votre position n'a pas pu être déterminée. Réessayez dans un instant.",
}

export const DEFAULT_GEO_ERROR =
  "Un problème est survenu avec la localisation. Réessayez dans un instant."

export const GEOLOCATION_UNAVAILABLE =
  "La géolocalisation n'est pas disponible sur cet appareil."

/** Traduit une erreur (code de position ou inconnue) en message utilisateur. */
export function messageFromGeoError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? Number((error as { code: unknown }).code)
      : Number.NaN
  return GEO_ERROR_MESSAGES[code] ?? DEFAULT_GEO_ERROR
}
