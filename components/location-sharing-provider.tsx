"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { stopLocationSharing, updateLocation } from "@/lib/actions/location"

const SHARE_INTERVAL_MS = 30_000

interface LocationSharingContextValue {
  isSharing: boolean
  error: string | null
  startSharing: () => Promise<void>
  stopSharing: () => Promise<void>
}

const LocationSharingContext = createContext<LocationSharingContextValue | null>(null)

/**
 * État unique du partage de position (toggle + indicateur partagent ce
 * contexte, sinon chacun aurait sa propre copie de `isSharing`).
 *
 * Quand le partage est actif, la position est publiée immédiatement puis
 * toutes les 30 s via la server action `updateLocation`.
 */
export function LocationSharingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pushPosition = useCallback(async () => {
    const userId = user?.id
    if (!userId) return

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        maximumAge: 30_000,
        timeout: 15_000,
      })
    })

    await updateLocation(
      position.coords.latitude,
      position.coords.longitude,
      position.coords.accuracy
    )
  }, [user?.id])

  const startSharing = useCallback(async () => {
    const userId = user?.id
    if (!userId) return

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("La géolocalisation n'est pas supportée par ce navigateur.")
      return
    }

    setError(null)
    try {
      // Première publication immédiate, puis cadence régulière.
      await pushPosition()
      setIsSharing(true)
      intervalRef.current = setInterval(() => {
        void pushPosition().catch((err) => {
          console.error("Échec de la mise à jour de la position :", err)
        })
      }, SHARE_INTERVAL_MS)
    } catch {
      setError(
        "Impossible d'accéder à votre position. Autorisez la géolocalisation dans votre navigateur."
      )
    }
  }, [pushPosition, user?.id])

  const stopSharing = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsSharing(false)
    try {
      await stopLocationSharing()
    } catch (err) {
      console.error("Échec de l'arrêt du partage de position :", err)
    }
  }, [])

  // Nettoyage de l'interval à la fermeture du composant.
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <LocationSharingContext.Provider
      value={{ isSharing, error, startSharing, stopSharing }}
    >
      {children}
    </LocationSharingContext.Provider>
  )
}

export function useLocationSharing(): LocationSharingContextValue {
  const context = useContext(LocationSharingContext)

  if (!context) {
    throw new Error(
      "useLocationSharing doit être utilisé à l'intérieur de <LocationSharingProvider>."
    )
  }

  return context
}