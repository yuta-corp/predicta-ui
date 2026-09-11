"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"

import {
  publishSharingNow,
  useLocationSharingStore,
  type SharingPhase,
} from "@/lib/store/location-sharing"

/**
 * Session de partage de position — colle entre Clerk et le store.
 *
 * Le composant ne rend rien de visible : il déclare l'utilisateur courant au
 * store (qui coupe la session GPS à la déconnexion et reprend un partage resté
 * actif côté serveur après un rafraîchissement) et réveille la publication
 * quand l'onglet revient au premier plan ou que le réseau revient.
 *
 * L'état lui-même vit dans `useLocationSharingStore` : n'importe quel composant
 * peut le lire sans traverser l'arbre des providers.
 */
export function LocationSharingProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser()
  const userId = user?.id ?? null

  useEffect(() => {
    if (!isLoaded) return
    useLocationSharingStore.getState().setUser(userId)
  }, [isLoaded, userId])

  // Le navigateur bride les intervalles en arrière-plan : en revenant au premier
  // plan (ou après une coupure réseau), on republie sans attendre le prochain tic.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") publishSharingNow()
    }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("online", publishSharingNow)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("online", publishSharingNow)
    }
  }, [])

  // Départ de l'application : capteur coupé, aucune surveillance fantôme.
  useEffect(() => {
    return () => {
      useLocationSharingStore.getState().setUser(null)
    }
  }, [])

  return <>{children}</>
}

interface LocationSharing {
  /** Vrai dès que le partage est demandé (acquisition comprise). */
  isSharing: boolean
  /** Phase précise, pour distinguer « recherche de position » de « partagé ». */
  phase: SharingPhase
  error: string | null
  startSharing: () => Promise<boolean>
  stopSharing: () => Promise<boolean>
}

/** État et actions du partage de position, lus depuis le store partagé. */
export function useLocationSharing(): LocationSharing {
  const phase = useLocationSharingStore((state) => state.phase)
  const error = useLocationSharingStore((state) => state.error)
  const startSharing = useLocationSharingStore((state) => state.startSharing)
  const stopSharing = useLocationSharingStore((state) => state.stopSharing)

  return { isSharing: phase !== "off", phase, error, startSharing, stopSharing }
}
