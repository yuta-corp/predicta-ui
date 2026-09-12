"use client"

import type {
  NotificationEntry,
  NotificationEntryKind,
} from "@/lib/notifications/events"
import { useMapFocusStore } from "@/lib/store/map-focus"

/**
 * Cible commune du toast et de la cloche : un partage de position ouvre la
 * **position de l'ami** (carte centrée sur lui, popup ouverte) ; une demande ou
 * une acceptation ouvre la page amis.
 */

/** Libellé du bouton d'action, selon le type d'événement. */
export function notificationActionLabel(kind: NotificationEntryKind): string {
  return kind === "sharing" ? "Voir sur la carte" : "Voir"
}

/** Route d'une notification — sert aussi de cible au service worker (push). */
export function notificationHref(entry: NotificationEntry): string {
  if (entry.kind === "sharing" && entry.actorId) {
    return `/map?friend=${encodeURIComponent(entry.actorId)}`
  }
  return "/friends"
}

/**
 * Ouvre une notification. La demande de recentrage est déposée dans le store
 * avant la navigation : la carte la consomme qu'elle soit déjà montée (on est
 * sur `/map`) ou qu'elle se monte après la navigation.
 */
export function openNotification(
  entry: NotificationEntry,
  push: (href: string) => void
): void {
  if (entry.kind === "sharing" && entry.actorId) {
    useMapFocusStore.getState().focusFriend(entry.actorId)
  }
  push(notificationHref(entry))
}
