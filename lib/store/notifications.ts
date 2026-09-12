"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  NOTIFICATION_ENTRY_KINDS,
  type NotificationEntry,
  type NotificationEntryKind,
} from "@/lib/notifications/events"
import type { FriendRequest } from "@/lib/types/social"

/** Nombre de notifications conservées : les plus récentes, jamais plus. */
export const MAX_RECENT_NOTIFICATIONS = 10

/** Clé de persistance — versionnée pour pouvoir invalider un ancien format. */
export const NOTIFICATIONS_STORAGE_KEY = "predicta:notifications:v1"

interface NotificationsState {
  /** Utilisateur auquel appartient l'état courant (jamais mélangé). */
  userId: string | null
  /** Demandes d'amis en attente — rechargées de zéro à chaque flux : volatiles. */
  requests: FriendRequest[]
  /** Activité récente, persistée localement (10 entrées au plus). */
  recent: NotificationEntry[]

  /** Change d'utilisateur : les notifications de l'ancien ne fuient jamais. */
  setUser: (userId: string | null) => void
  /** État initial du flux (demandes en attente) — aucune rétroaction. */
  applySnapshot: (requests: FriendRequest[]) => void
  /** Nouveaux événements + demandes à jour. */
  applyTick: (requests: FriendRequest[], events: NotificationEntry[]) => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      userId: null,
      requests: [],
      recent: [],

      setUser: (userId) => {
        set((state) =>
          state.userId === userId
            ? state
            : { userId, requests: [], recent: [] }
        )
      },

      applySnapshot: (requests) => {
        set({ requests })
      },

      applyTick: (requests, events) => {
        set((state) => ({
          requests,
          recent: mergeRecentNotifications(state.recent, events),
        }))
      },
    }),
    {
      name: NOTIFICATIONS_STORAGE_KEY,
      // Le stockage n'est lu qu'après montage (voir le provider) : le premier
      // rendu client est identique au HTML serveur, aucune désynchronisation.
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userId: state.userId, recent: state.recent }),
      // localStorage n'est pas de confiance : on valide avant de l'exposer.
      merge: (persisted, current) => {
        const saved = persisted as Partial<NotificationsState> | undefined
        return {
          ...current,
          userId: typeof saved?.userId === "string" ? saved.userId : null,
          recent: sanitizeRecentNotifications(saved?.recent),
        }
      },
    }
  )
)

/**
 * Fusionne les nouveaux événements (plus récents) avec l'historique, sans
 * doublon d'identifiant, en ne conservant que {@link MAX_RECENT_NOTIFICATIONS}
 * entrées. Un événement rejoué (ex. un ami qui repartage) remonte en tête avec
 * son horodatage à jour au lieu de s'empiler.
 */
export function mergeRecentNotifications(
  existing: readonly NotificationEntry[],
  incoming: readonly NotificationEntry[]
): NotificationEntry[] {
  const seen = new Set<string>()
  const merged: NotificationEntry[] = []
  // Boucle bornée : on s'arrête dès la limite atteinte.
  for (const entry of [...incoming, ...existing]) {
    if (seen.has(entry.id)) continue
    seen.add(entry.id)
    merged.push(entry)
    if (merged.length >= MAX_RECENT_NOTIFICATIONS) break
  }
  return merged
}

/** Ne garde que des entrées bien formées, plafonnées à la limite. */
export function sanitizeRecentNotifications(value: unknown): NotificationEntry[] {
  if (!Array.isArray(value)) return []
  const valid = value.filter(
    (entry): entry is NotificationEntry =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as NotificationEntry).id === "string" &&
      typeof (entry as NotificationEntry).title === "string" &&
      typeof (entry as NotificationEntry).actorId === "string" &&
      Number.isFinite((entry as NotificationEntry).createdAt) &&
      NOTIFICATION_ENTRY_KINDS.includes(
        (entry as NotificationEntry).kind as NotificationEntryKind
      )
  )
  return valid.slice(0, MAX_RECENT_NOTIFICATIONS)
}
