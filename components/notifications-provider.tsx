"use client"

import { createContext, useContext, useEffect, useMemo } from "react"
import { useUser } from "@clerk/nextjs"

import { useNotificationStream } from "@/hooks/use-notification-stream"
import type { NotificationEntry } from "@/lib/notifications/events"
import { useNotificationsStore } from "@/lib/store/notifications"
import { getPersistApi } from "@/lib/store/persist"
import type { FriendRequest } from "@/lib/types/social"

export type { NotificationEntry, NotificationEntryKind } from "@/lib/notifications/events"

interface NotificationsContextValue {
  /** Rebranche immédiatement le flux (après accept/refus, ex.). */
  refresh: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

/**
 * Notifications push serveur (SSE) : le transport vit dans
 * `useNotificationStream`, l'état dans `useNotificationsStore`. Ici, on
 * branche l'utilisateur courant et on restaure l'historique persisté.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser()
  const userId = user?.id ?? null
  const { connect, refresh } = useNotificationStream()

  useEffect(() => {
    if (!isLoaded) return

    const persistApi = getPersistApi(useNotificationsStore)
    // Sans persistance (stockage indisponible), il n'y a rien à restaurer : on
    // branche directement.
    if (!persistApi || persistApi.hasHydrated()) return connect(userId)

    // L'historique local n'est lu qu'après montage — le premier rendu client est
    // identique au HTML serveur — et la connexion ne démarre qu'une fois la
    // lecture terminée : l'état par défaut n'écrase jamais ce qui est persisté.
    let disconnect: (() => void) | null = null
    let cancelled = false
    const unsubscribe = persistApi.onFinishHydration(() => {
      if (cancelled) return
      disconnect = connect(userId)
    })
    void persistApi.rehydrate()

    return () => {
      cancelled = true
      unsubscribe()
      disconnect?.()
    }
  }, [isLoaded, userId, connect])

  const contextValue = useMemo(() => ({ refresh }), [refresh])

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  )
}

/**
 * Notifications de l'utilisateur courant : les données viennent du store
 * partagé, `refresh` du flux SSE (qui, lui, exige le provider).
 */
export function useNotifications(): {
  requests: FriendRequest[]
  recent: NotificationEntry[]
  refresh: () => void
} {
  const requests = useNotificationsStore((state) => state.requests)
  const recent = useNotificationsStore((state) => state.recent)
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error(
      "useNotifications doit être utilisé à l'intérieur de <NotificationsProvider>."
    )
  }

  return { requests, recent, refresh: context.refresh }
}
