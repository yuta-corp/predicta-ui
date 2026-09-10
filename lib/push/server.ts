import webPush from "web-push"
import { prisma } from "@/lib/prisma"
import { PUSH_TTL_SECONDS, pushConfigured } from "@/lib/push/vapid"
import type { NotificationEntry } from "@/lib/notifications/events"

/** Contenu d'un push envoyé au navigateur (en JSON dans la charge utile). */
export interface PushPayload {
  /** Identifiant stable : sert de tag de dédoublonnage côté service worker. */
  id: string
  title: string
  /** URL interne à ouvrir au clic sur la notification. */
  url: string
  body?: string
}

/** Dérive le payload push d'une entrée de notification SSE (source unique). */
export function pushPayloadFromEntry(entry: NotificationEntry): PushPayload {
  const url = entry.kind === "sharing" ? "/map" : "/friends"
  return { id: entry.id, title: entry.title, url }
}

interface PushSubscriptionInput {
  endpoint: string
  keys: { auth: string; p256dh: string }
}

/** Conserve l'abonnement push d'un navigateur (upsert par endpoint). */
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionInput
): Promise<void> {
  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
    update: {
      userId,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
  })
}

/** Retire un abonnement (révocation côté client). */
export async function removePushSubscription(
  userId: string,
  endpoint: string
): Promise<void> {
  await prisma.pushSubscription.deleteMany({ where: { userId, endpoint } })
}

/** Répond « vrai » pour une erreur d'endpoint devenu invalide (désabonné). */
function isDeadEndpoint(err: unknown): boolean {
  if (err instanceof webPush.WebPushError) {
    return err.statusCode === 404 || err.statusCode === 410
  }
  return err instanceof Error && err.name === "PushSubscriptionUnsubscribedError"
}

/**
 * Envoie une notification push à tous les appareils de l'utilisateur.
 * Ne lève jamais : les notifications sont un bonus, l'action appelante doit
 * aboutir même si un service push est injoignable. Les endpoints invalides
 * sont nettoyés automatiquement (404/410).
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<void> {
  if (!pushConfigured) return

  const rows = await prisma.pushSubscription.findMany({
    where: { userId },
    select: { endpoint: true, auth: true, p256dh: true },
  })
  if (rows.length === 0) return

  const body = JSON.stringify(payload)
  const invalidEndpoints: string[] = []

  await Promise.all(
    rows.map(async (row) => {
      try {
        await webPush.sendNotification(
          { endpoint: row.endpoint, keys: { auth: row.auth, p256dh: row.p256dh } },
          body,
          { TTL: PUSH_TTL_SECONDS }
        )
      } catch (err) {
        if (isDeadEndpoint(err)) {
          invalidEndpoints.push(row.endpoint)
        } else {
          console.error("[push] envoi échoué :", err)
        }
      }
    })
  )

  if (invalidEndpoints.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: invalidEndpoints } },
    })
  }
}