/**
 * Transport SSE des notifications, hors React (donc testable directement).
 *
 * Une seule `EventSource` est ouverte sur /api/notifications. Chaque message
 * porte un `id:` (curseur ms) avancé après traitement : à la reconnexion le
 * navigateur renvoie `Last-Event-ID`, et l'ouverture manuelle (retour de
 * visibilité) transmet le curseur courant — rien n'est perdu ni dupliqué.
 */

import type {
  NotificationEntry,
  NotificationSnapshot,
  NotificationTick,
} from "@/lib/notifications/events"
import { registerServiceWorker } from "@/lib/push/client"
import { useNotificationsStore } from "@/lib/store/notifications"

export interface NotificationStream {
  /** Branche un utilisateur (ou débranche avec null). Renvoie le débranchement. */
  connect: (userId: string | null) => () => void
  /** Rebranche immédiatement le flux (après accept/refus, ex.). */
  refresh: () => void
}

/** Décodage défensif d'un message SSE (un message illisible est ignoré). */
export function readStreamMessage(
  raw: string
): NotificationSnapshot | NotificationTick | null {
  try {
    return JSON.parse(raw) as NotificationSnapshot | NotificationTick
  } catch (err) {
    console.error("[notifications] message SSE illisible :", err)
    return null
  }
}

/** Applique un message au store et remonte les nouveaux événements. */
export function applyStreamMessage(
  data: NotificationSnapshot | NotificationTick,
  onEntry: (entry: NotificationEntry) => void
): void {
  const store = useNotificationsStore.getState()
  if (data.type === "snapshot") {
    store.applySnapshot(data.requests)
    return
  }
  store.applyTick(data.requests, data.events)
  for (const entry of data.events) onEntry(entry)
}

export function createStreamController(
  onEntry: (entry: NotificationEntry) => void
): NotificationStream {
  let source: EventSource | null = null
  let cursor = 0
  let ownerId: string | null = null

  const open = (userId: string) => {
    source?.close()
    ownerId = userId
    const url = new URL("/api/notifications", window.location.origin)
    if (cursor > 0) url.searchParams.set("cursor", String(cursor))
    const next = new EventSource(url)
    source = next
    next.onmessage = (event) => {
      // Un flux tardif (utilisateur déjà changé) n'écrit jamais dans le store.
      if (ownerId !== userId) return
      const data = readStreamMessage(event.data)
      if (!data) return
      if (event.lastEventId) cursor = Number(event.lastEventId)
      applyStreamMessage(data, onEntry)
    }
    // Sur erreur, EventSource se reconnecte seul avec Last-Event-ID.
  }

  const connect = (userId: string | null): (() => void) => {
    useNotificationsStore.getState().setUser(userId)
    source?.close()
    source = null
    ownerId = null
    cursor = 0
    if (!userId) return () => {}

    open(userId)
    // Enregistre le service worker (idempotent) : requis pour que le toggle
    // push s'abonne instantanément et pour les notificationclick.
    void registerServiceWorker().catch(() => {})

    // Pause quand l'onglet est masqué (zéro trafic réseau), reprise au curseur.
    const onVisibility = () => {
      if (document.visibilityState === "visible") open(userId)
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      source?.close()
      source = null
      ownerId = null
    }
  }

  return {
    connect,
    refresh: () => {
      if (ownerId) open(ownerId)
    },
  }
}
