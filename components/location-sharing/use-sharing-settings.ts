"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { listFriends } from "@/lib/actions/friends"
import {
  createLocationLink,
  getMyLocationLink,
  getShareViewers,
  revokeLocationLink,
  setShareViewers,
} from "@/lib/actions/location"
import type { Friend } from "@/lib/types/social"

export interface SharingSettings {
  friends: Friend[]
  viewers: string[]
  linkToken: string | null
  loading: boolean
  toggleViewer: (friendId: string, checked: boolean) => void
  toggleAllViewers: (checked: boolean) => void
  createLink: () => Promise<void>
  revokeLink: () => Promise<void>
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

/** Amis autorisés à voir la position (audience ciblée ou « tous »). */
function useShareViewers(open: boolean) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [viewers, setViewers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void (async () => {
      try {
        const [loadedFriends, loadedViewers] = await Promise.all([
          listFriends(),
          getShareViewers(),
        ])
        if (cancelled) return
        setFriends(loadedFriends)
        setViewers(loadedViewers)
      } catch (err) {
        if (!cancelled) {
          toast.error(errorMessage(err, "Impossible de charger les réglages du partage."))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  /** Enregistre une nouvelle sélection ; restaure la précédente si ça échoue. */
  const persist = useCallback(async (next: string[], previous: string[]) => {
    setViewers(next)
    try {
      await setShareViewers(next)
    } catch (err) {
      setViewers(previous)
      toast.error(errorMessage(err, "Impossible d'enregistrer la sélection."))
    }
  }, [])

  const toggleViewer = (friendId: string, checked: boolean) => {
    const next = checked
      ? [...viewers, friendId]
      : viewers.filter((id) => id !== friendId)
    void persist(next, viewers)
  }

  const toggleAllViewers = (checked: boolean) => {
    const next = checked ? friends.map((friend) => friend.userId) : []
    void persist(next, viewers)
  }

  return { friends, viewers, loading, toggleViewer, toggleAllViewers }
}

/** Lien secret de partage : création, copie, révocation. */
function useLocationLink(open: boolean) {
  const [linkToken, setLinkToken] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void (async () => {
      try {
        const token = await getMyLocationLink()
        if (!cancelled) setLinkToken(token)
      } catch (err) {
        if (!cancelled) {
          toast.error(errorMessage(err, "Impossible de charger le lien de partage."))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  const createLink = async () => {
    try {
      const token = await createLocationLink()
      setLinkToken(token)
      toast.success("Lien de partage créé")
    } catch (err) {
      toast.error(errorMessage(err, "Impossible de créer le lien."))
    }
  }

  const revokeLink = async () => {
    if (!linkToken) return
    try {
      await revokeLocationLink(linkToken)
      setLinkToken(null)
      toast.success("Lien révoqué")
    } catch (err) {
      toast.error(errorMessage(err, "Impossible de révoquer le lien."))
    }
  }

  return { linkToken, createLink, revokeLink }
}

/**
 * Réglages du partage de position : amis, audience autorisée et lien secret.
 * Le chargement se fait à l'ouverture du panneau (dernier état du serveur).
 */
export function useSharingSettings(open: boolean): SharingSettings {
  const viewers = useShareViewers(open)
  const link = useLocationLink(open)
  return { ...viewers, ...link }
}
