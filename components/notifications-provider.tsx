"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  getRecentlyAcceptedFriendRequests,
  listFriendRequests,
} from "@/lib/actions/friends"
import { getFriendsLocations } from "@/lib/actions/location"
import {
  acceptedKey,
  diffAcceptedRequests,
  diffIncomingRequests,
  diffNewSharers,
} from "@/lib/notifications/diff"
import type { FriendRequest } from "@/lib/types/social"

const POLL_INTERVAL_MS = 30_000
const MAX_RECENT = 10

export type NotificationEntryKind = "request" | "accepted" | "sharing"

export interface NotificationEntry {
  id: string
  kind: NotificationEntryKind
  title: string
}

interface NotificationsState {
  /** Utilisateur propriétaire de `requests`/`recent` (sécurité de session). */
  userId: string
  requests: FriendRequest[]
  recent: NotificationEntry[]
}

interface NotificationsContextValue {
  /** Demandes d'amis reçues en attente (alimente le badge de la cloche). */
  requests: FriendRequest[]
  /** Activité récente (demandes reçues, acceptations, partages débutés). */
  recent: NotificationEntry[]
  /** Re-polle immédiatement (après accept/refus, par ex.). */
  refresh: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

/**
 * Cloche de notifications : pose un socle de relecture (baseline, sans toast)
 * puis poll toutes les 30 s demandes reçues, acceptations de demandes
 * sortantes et nouveaux partageurs de position. Un toast est affiché pour
 * chaque nouvel événement, et l'activité récente alimente le panneau cloche.
 *
 * L'état est keyé par identifiant utilisateur : si la session change, les
 * anciennes notifications ne sont jamais exposées (le rendu dérive de
 * `state.userId === user.id`). Une génération invalide les sondages obsolètes
 * restés en vol au moment d'un changement de session.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser()
  const router = useRouter()

  const [state, setState] = useState<NotificationsState>({
    userId: "",
    requests: [],
    recent: [],
  })
  const baselineDone = useRef(false)
  const generation = useRef(0)
  const polling = useRef(false)
  const seenRequests = useRef<Set<string>>(new Set())
  const seenAccepted = useRef<Set<string>>(new Set())
  const seenSharers = useRef<Set<string>>(new Set())
  const runPollRef = useRef(() => Promise.resolve())

  useEffect(() => {
    const userId = user?.id
    if (!isLoaded || !userId) return

    baselineDone.current = false
    seenRequests.current.clear()
    seenAccepted.current.clear()
    seenSharers.current.clear()
    generation.current += 1
    const gen = generation.current

    let cancelled = false

    const poll = async () => {
      if (polling.current) return
      polling.current = true
      try {
        const [incoming, acceptedRequests, locations] = await Promise.all([
          listFriendRequests(),
          getRecentlyAcceptedFriendRequests(),
          getFriendsLocations(),
        ])
        if (cancelled || gen !== generation.current) return

        // Premier passage : baseline, on ne notifie pas.
        if (!baselineDone.current) {
          baselineDone.current = true
          for (const request of incoming) seenRequests.current.add(request.id)
          for (const item of acceptedRequests) seenAccepted.current.add(acceptedKey(item))
          for (const location of locations) seenSharers.current.add(location.userId)
          setState({ userId, requests: incoming, recent: [] })
          return
        }

        const newRequests = diffIncomingRequests(seenRequests.current, incoming)
        const newAccepted = diffAcceptedRequests(seenAccepted.current, acceptedRequests)
        const newSharers = diffNewSharers(seenSharers.current, locations)

        for (const request of newRequests) seenRequests.current.add(request.id)
        for (const item of newAccepted) seenAccepted.current.add(acceptedKey(item))
        for (const location of newSharers) seenSharers.current.add(location.userId)

        const entries: NotificationEntry[] = [
          ...newRequests.map((request) => ({
            id: `request:${request.id}`,
            kind: "request" as const,
            title: `${request.fromName} vous a envoyé une demande d'ami.`,
          })),
          ...newAccepted.map((item) => ({
            id: `accepted:${item.friendId}:${item.acceptedAt.getTime()}`,
            kind: "accepted" as const,
            title: `${item.friendName} a accepté votre demande.`,
          })),
          ...newSharers.map((location) => ({
            id: `sharing:${location.userId}`,
            kind: "sharing" as const,
            title: `${location.name} a commencé à partager sa position.`,
          })),
        ]

        setState((prev) => ({
          userId,
          requests: incoming,
          recent:
            entries.length > 0
              ? [
                  ...entries,
                  ...(prev.userId === userId ? prev.recent : []),
                ].slice(0, MAX_RECENT)
              : prev.userId === userId
                ? prev.recent
                : [],
        }))

        if (entries.length > 0) {
          for (const entry of entries) {
            toast(entry.title, {
              action: {
                label: "Voir",
                onClick: () => router.push("/friends"),
              },
            })
          }
        }
      } catch (err) {
        console.error("Impossible de rafraîchir les notifications :", err)
      } finally {
        polling.current = false
      }
    }

    runPollRef.current = () => poll()

    void poll()
    const interval = setInterval(() => void poll(), POLL_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === "visible") void poll()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [isLoaded, user?.id, router])

  const refresh = useCallback(() => runPollRef.current(), [])

  const current = state.userId === user?.id ? state : null

  return (
    <NotificationsContext.Provider
      value={{
        requests: current?.requests ?? [],
        recent: current?.recent ?? [],
        refresh,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      "useNotifications doit être utilisé à l'intérieur de <NotificationsProvider>."
    )
  }
  return context
}