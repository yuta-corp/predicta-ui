"use client"

import { useUserGeolocation } from "@/hooks/use-user-geolocation"

/**
 * Géolocalisation automatique de la carte — ne rend rien : tout le
 * comportement vit dans `useUserGeolocation` (permission, point « live »,
 * suivi de caméra, toasts d'erreur).
 */
export function GeolocationControl() {
  useUserGeolocation()
  return null
}
