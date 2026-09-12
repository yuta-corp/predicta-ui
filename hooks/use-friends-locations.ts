"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { getFriendsLocations } from "@/lib/actions/location"
import type { FriendLocation } from "@/lib/types/social"

const POLL_INTERVAL_MS = 30_000

interface LocationsState {
  userId: string
  locations: FriendLocation[] | null
  error: string | null
}

/**
 * Positions partagées des amis, rafraîchies toutes les 30 s.
 *
 * L'état est keyé par identifiant utilisateur : si la session change, les
 * anciennes positions ne sont jamais exposées au nouvel utilisateur (le
 * rendu dérive de `state.userId === user.id`).
 *
 * En cas d'échec ponctuel, on conserve les dernières positions connues (on
 * ne vide pas la carte au premier retour réseau perdu), on ne signale que
 * l'erreur.
 *
 * Le rafraîchissement est immédiat quand l'onglet redevient visible : les
 * navigateurs brident les intervalles en arrière-plan, une position fraîche ne
 * doit pas attendre le tic suivant pour apparaître.
 */
export function useFriendsLocations() {
  const { user } = useUser()
  const [state, setState] = useState<LocationsState>({
    userId: "",
    locations: null,
    error: null,
  })

  useEffect(() => {
    const userId = user?.id
    if (!userId) return

    let cancelled = false

    const fetchLocations = async () => {
      try {
        const locations = await getFriendsLocations()
        if (!cancelled) setState({ userId, locations, error: null })
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            userId,
            locations: prev.userId === userId ? prev.locations : null,
            error:
              err instanceof Error
                ? err.message
                : "Impossible de charger les positions de vos amis.",
          }))
        }
      }
    }

    void fetchLocations()
    const interval = setInterval(fetchLocations, POLL_INTERVAL_MS)

    const onVisibility = () => {
      if (document.visibilityState === "visible") void fetchLocations()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [user?.id])

  const current = state.userId === user?.id ? state : null

  return { data: current?.locations ?? null, error: current?.error ?? null }
}