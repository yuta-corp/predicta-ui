"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { stopLocationSharing, updateLocation } from "@/lib/actions/location"
import { createPositionFilter, type PositionFix } from "@/lib/map/position-filter"

const SHARE_INTERVAL_MS = 30_000

/**
 * Options de géolocalisation « précision maximale » : haute précision (GPS),
 * aucun cache (`maximumAge: 0` → chaque fix est frais) et un timeout généreux
 * — le capteur a le temps d'acquérir les satellites au lieu de rendre un fix
 * réseau approximatif faute de temps.
 */
const GEO_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 30_000,
} as const

interface LocationSharingContextValue {
  isSharing: boolean
  error: string | null
  startSharing: () => Promise<boolean>
  stopSharing: () => Promise<boolean>
}

const LocationSharingContext = createContext<LocationSharingContextValue | null>(null)

function positionToFix(position: GeolocationPosition): PositionFix {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  }
}

/**
 * État unique du partage de position : dès le début du partage, un
 * `watchPosition` haute précision est lancé et reste actif — le GPS affine la
 * position en continu, chaque nouveau fix remplace le candidat du tour suivant.
 *
 * Publication immédiate du premier fix, puis toutes les 30 s : le fix le plus
 * précis *à l'instant de la publication* passe par un filtre anti-régression
 * (on ne redégrade jamais la précision déjà publiée, sauf rassissement), la
 * position partagée ne « tremble » pas au mètre près.
 *
 * `startSharing`/`stopSharing` renvoient `true` en cas de succès réel : établi
 * seulement si la première position a bien été publiée.
 */
export function LocationSharingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const latestFixRef = useRef<PositionFix | null>(null)
  const lastPublishedRef = useRef<PositionFix | null>(null)
  const filterRef = useRef(createPositionFilter())

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  /** Publie le fix courant (filtré), ou le dernier publié si le fil le refuse. */
  const publishLatest = useCallback(async () => {
    const latest = latestFixRef.current
    if (!latest) return
    const accepted =
      filterRef.current.next(latest) ?? lastPublishedRef.current ?? latest
    lastPublishedRef.current = accepted
    await updateLocation(accepted.latitude, accepted.longitude, accepted.accuracy)
  }, [])

  const stopSharing = useCallback(async (): Promise<boolean> => {
    clearWatch()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    latestFixRef.current = null
    lastPublishedRef.current = null
    filterRef.current.reset()
    setIsSharing(false)
    setError(null)
    try {
      await stopLocationSharing()
      return true
    } catch (err) {
      console.error("Échec de l'arrêt du partage de position :", err)
      setError("Impossible d'arrêter le partage pour le moment.")
      return false
    }
  }, [clearWatch])

  const startSharing = useCallback(async (): Promise<boolean> => {
    if (!user?.id || isSharing) return false

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("La géolocalisation n'est pas supportée par ce navigateur.")
      return false
    }

    setError(null)
    try {
      // Le watchPosition est le capteur principal : il fournit le premier fix
      // et continue de raffiner la précision tant que le partage est actif.
      const firstFix = await new Promise<PositionFix>((resolve, reject) => {
        let settled = false
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const fix = positionToFix(position)
            latestFixRef.current = fix
            if (!settled) {
              settled = true
              resolve(fix)
            }
          },
          (err) => {
            if (settled) return
            settled = true
            clearWatch()
            reject(err)
          },
          GEO_OPTIONS
        )
      })

      await updateLocation(firstFix.latitude, firstFix.longitude, firstFix.accuracy)
      lastPublishedRef.current = firstFix
      setIsSharing(true)
      intervalRef.current = setInterval(() => {
        void publishLatest().catch((err) => {
          console.error("Échec de la mise à jour de la position :", err)
          setError("La mise à jour de votre position échoue. Vérifiez votre connexion.")
        })
      }, SHARE_INTERVAL_MS)
      return true
    } catch {
      clearWatch()
      setError(
        "Impossible d'accéder à votre position. Autorisez la géolocalisation dans votre navigateur."
      )
      return false
    }
  }, [user?.id, isSharing, clearWatch, publishLatest])

  // Nettoyage du watch et de l'interval à la fermeture du composant.
  useEffect(() => {
    return () => {
      clearWatch()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [clearWatch])

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