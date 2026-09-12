"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { NotificationEntry } from "@/lib/notifications/events"
import {
  notificationActionLabel,
  openNotification,
} from "@/lib/notifications/open"
import {
  createStreamController,
  type NotificationStream,
} from "@/lib/notifications/stream"

/** Toast d'une notification : son action ouvre la cible (ami, page amis). */
function useNotificationToast(): (entry: NotificationEntry) => void {
  const router = useRouter()
  return useCallback(
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
}

/**
 * Notifications push serveur via SSE. Tout le transport vit dans
 * `lib/notifications/stream` ; ce hook ne branche que l'affichage (toast) et
 * garde un contrôleur unique (il lit le toast via une fonction stable, qui ne
 * dépend que du routeur — stable d'un rendu à l'autre dans l'App Router).
 */
export function useNotificationStream(): NotificationStream {
  const showToast = useNotificationToast()
  const [controller] = useState(() => createStreamController(showToast))
  return controller
}
