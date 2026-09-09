"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  type NotificationEntry,
  type NotificationSnapshot,
  type NotificationTick,
} from "@/lib/notifications/events"
import type { FriendRequest } from "@/lib/types/social"

export type { NotificationEntry, NotificationEntryKind } from "@/lib/notifications/events"

const MAX_RECENT = 10

interface NotificationsState {
  userId: string
  requests: FriendRequest[]
  recent: NotificationEntry[]
}

interface NotificationsContextValue {
  requests: FriendRequest[]
  recent: NotificationEntry[]
  /** Rebranche immédiatement le flux (après accept/refus, ex.). */
  refresh: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

/**
 * Cloche de notifications — push serveur via Server-Sent Events.
 *
 * Une seule `EventSource` ouverte sur /api/notifications : le serveur sample
 * la base et pousse les nouveaux événements. Chaque message porte un `id:`
 * (curseur ms) ; à la reconnexion le navigateur renvoie `Last-Event-ID`, on
 * donne explicitement le curseur à l'ouverture manuelle (onglet caché →
 * visible, refresh) — rien n'est perdu ni dupliqué.
 *
 * L'état est keyé par identifiant utilisateur : si la session change, les
 * anciennes notifications ne sont jamais exposées.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser()
  const router = useRouter()

  const [state, setState] = useState<NotificationsState>({
    userId: "",
    requests: [],
    recent: [],
  })
  const esRef = useRef<EventSource | null>(null)
  const cursorRef = useRef<number>(0)
  const userIdRef = useRef<string | null>(null)

  const attachStream = useCallback(
    (es: EventSource, userId: string) => {
      es.onmessage = (event) => {
        if (event.lastEventId) cursorRef.current = Number(event.lastEventId)
        try {
          const data = JSON.parse(event.data) as NotificationSnapshot | NotificationTick
          const isSnapshot = !("events" in data)

          if (isSnapshot) {
            setState((prev) => ({
              userId,
              requests: data.requests,
              recent: prev.userId === userId ? prev.recent : [],
            }))
            return
          }

          setState((prev) => ({
            userId,
            requests: data.requests,
            recent:
              data.events.length > 0
                ? [...data.events, ...(prev.userId === userId ? prev.recent : [])].slice(
                    0,
                    MAX_RECENT
                  )
                : prev.userId === userId
                  ? prev.recent
                  : [],
          }))

          // Événement arrivé pendant que l'onglet était visible : toast.
          if (data.events.length > 0) {
            for (const entry of data.events) {
              toast(entry.title, {
                action: {
                  label: "Voir",
                  onClick: () => router.push("/friends"),
                },
              })
            }
          }
        } catch (err) {
          console.error("[notifications] message SSE illisible :", err)
        }
      }
      // Sur erreur, EventSource se reconnecte seul avec Last-Event-ID.
    },
    [router]
  )

  const openStream = useCallback(
    (userId: string) => {
      esRef.current?.close()
      const url = new URL("/api/notifications", window.location.origin)
      if (cursorRef.current > 0) url.searchParams.set("cursor", String(cursorRef.current))
      const es = new EventSource(url)
      esRef.current = es
      attachStream(es, userId)
    },
    [attachStream]
  )

  useEffect(() => {
    const userId = user?.id ?? null
    if (!isLoaded) return
    userIdRef.current = userId
    cursorRef.current = 0

    esRef.current?.close()
    esRef.current = null
    if (userId) openStream(userId)

    // Pause quand l'onglet est masqué (zéro trafic réseau), reprise au curseur.
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      const current = userIdRef.current
      if (current) openStream(current)
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      esRef.current?.close()
      esRef.current = null
    }
  }, [isLoaded, user?.id, openStream])

  const refresh = useCallback(async () => {
    const userId = userIdRef.current
    if (userId) openStream(userId)
  }, [openStream])

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