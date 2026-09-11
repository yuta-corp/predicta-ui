"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  type NotificationEntry,
  type NotificationSnapshot,
  type NotificationTick,
} from "@/lib/notifications/events"
import { notificationActionLabel, openNotification } from "@/lib/notifications/open"
import { registerServiceWorker } from "@/lib/push/client"
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
 * Flux de notifications — push serveur via Server-Sent Events.
 *
 * Une seule `EventSource` ouverte sur /api/notifications : le serveur sample la
 * base et pousse les nouveaux événements. Chaque message porte un `id:`
 * (curseur ms) ; à la reconnexion le navigateur renvoie `Last-Event-ID`, on
 * donne explicitement le curseur à l'ouverture manuelle (onglet caché → visible,
 * refresh) — rien n'est perdu ni dupliqué.
 *
 * Ce composant ne fait QUE le transport : l'état vit dans
 * `useNotificationsStore` (10 entrées persistées au plus, keyées par
 * utilisateur).
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser()
  const userId = user?.id ?? null
  const router = useRouter()

  const esRef = useRef<EventSource | null>(null)
  const cursorRef = useRef<number>(0)
  /** Utilisateur propriétaire du flux ouvert (garde-fou anti-fuite). */
  const streamUserIdRef = useRef<string | null>(null)

  /** Affiche un toast dont l'action ouvre la cible de la notification. */
  const showToast = useCallback(
    (entry: NotificationEntry) => {
      toast(entry.title, {
        // L'identifiant stabilise le toast : un événement rejoué met à jour le
        // toast existant au lieu d'en empiler un doublon.
        id: entry.id,
        action: {
          label: notificationActionLabel(entry.kind),
          onClick: () => openNotification(entry, router.push),
        },
      })
    },
    [router]
  )

  const attachStream = useCallback(
    (es: EventSource, streamUserId: string) => {
      es.onmessage = (event) => {
        // Un flux tardif (utilisateur déjà changé) n'écrit jamais dans le store.
        if (streamUserIdRef.current !== streamUserId) return

        // On n'avance le curseur qu'après un traitement réussi : un message
        // illisible ne fait pas perdre définitivement ses événements.
        let data: NotificationSnapshot | NotificationTick
        try {
          data = JSON.parse(event.data) as NotificationSnapshot | NotificationTick
        } catch (err) {
          console.error("[notifications] message SSE illisible :", err)
          return
        }
        if (event.lastEventId) cursorRef.current = Number(event.lastEventId)

        const store = useNotificationsStore.getState()
        if (data.type === "snapshot") {
          store.applySnapshot(data.requests)
          return
        }

        store.applyTick(data.requests, data.events)
        // Événement arrivé pendant que l'onglet était visible : toast.
        for (const entry of data.events) showToast(entry)
      }
      // Sur erreur, EventSource se reconnecte seul avec Last-Event-ID.
    },
    [showToast]
  )

  const openStream = useCallback(
    (streamUserId: string) => {
      esRef.current?.close()
      streamUserIdRef.current = streamUserId
      const url = new URL("/api/notifications", window.location.origin)
      if (cursorRef.current > 0) url.searchParams.set("cursor", String(cursorRef.current))
      const es = new EventSource(url)
      esRef.current = es
      attachStream(es, streamUserId)
    },
    [attachStream]
  )

  /**
   * Branche l'utilisateur : identité dans le store, flux SSE, reprise quand
   * l'onglet redevient visible. Renvoie la fonction de débranchement.
   */
  const connect = useCallback(
    (streamUserId: string | null): (() => void) => {
      useNotificationsStore.getState().setUser(streamUserId)
      esRef.current?.close()
      esRef.current = null
      streamUserIdRef.current = null
      cursorRef.current = 0

      if (!streamUserId) return () => {}

      openStream(streamUserId)
      // Enregistre le service worker (idempotent) : requis pour que le toggle
      // push s'abonne instantanément et pour les notificationclick.
      void registerServiceWorker().catch(() => {})

      // Pause quand l'onglet est masqué (zéro trafic réseau), reprise au curseur.
      const onVisibility = () => {
        if (document.visibilityState === "visible") openStream(streamUserId)
      }
      document.addEventListener("visibilitychange", onVisibility)

      return () => {
        document.removeEventListener("visibilitychange", onVisibility)
        esRef.current?.close()
        esRef.current = null
        streamUserIdRef.current = null
      }
    },
    [openStream]
  )

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

  const refresh = useCallback(() => {
    if (streamUserIdRef.current) openStream(streamUserIdRef.current)
  }, [openStream])

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
