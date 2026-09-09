import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"

import {
  buildEvents,
  listAcceptedSince,
  listNewSharersSince,
  listPendingRequests,
} from "@/lib/notifications/server-service"
import type { NotificationEntry, NotificationSnapshot } from "@/lib/notifications/events"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Intervalle d'échantillonnage des nouvelles notifications (serveur).
 */
const SAMPLE_MS = 8_000

/**
 * Durée de vie du flux. Sur Vercel serverless, un flux fermé proprement puis
 * reconnecté via `Last-Event-ID` est plus robuste (et moins coûteux) qu'un
 * flux éternel : l'EventSource du navigateur reprend automatiquement au
 * curseur exact où le précédent s'est arrêté.
 */
const STREAM_TTL_MS = 45_000

/**
 * Keep-alive SSE si aucune notification n'est envoyée pendant ce délai.
 */
const KEEPALIVE_MS = 20_000

function sseComment(line: string): string {
  return `: ${line}\n\n`
}

/**
 * SSE push des notifications : le serveur sample la base toutes les 8 s et
 * pousse les nouveaux événements (demandes reçues, acceptations, nouveaux
 * partageurs) au client. Chaque message porte un `id:` (curseur ms) : l'API
 * EventSource du navigateur le renvoie en `Last-Event-ID` à la reconnexion,
 * rien n'est perdu ni dupliqué.
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Non autorisé", { status: 401 })
  }

  // Curseur de reprise : Last-Event-ID renvoyé par le navigateur, sinon
  // premier snapshot = état courant, aucune notification rétroactive.
  const resumedCursor =
    Number(request.headers.get("last-event-id")) ||
    Number(request.nextUrl.searchParams.get("cursor"))
  const cursor = Number.isFinite(resumedCursor) && resumedCursor > 0 ? resumedCursor : Date.now()

  const encoder = new TextEncoder()
  let lastCursor = cursor
  let lastPing = Date.now()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (message: string) => {
        try {
          controller.enqueue(encoder.encode(message))
        } catch (err) {
          console.error("[notifications] envoi SSE échoué :", err)
        }
      }

      // Premier message : état courant (badge des demandes en attente).
      // Pas de notification rétroactive sur un premier contact.
      try {
        const pending = await listPendingRequests(userId)
        lastCursor = cursor
        const snapshot: NotificationSnapshot = { requests: pending }
        send(`id: ${lastCursor}\ndata: ${JSON.stringify(snapshot)}\n\n`)
      } catch (err) {
        console.error("[notifications] snapshot initial échoué :", err)
        controller.error(err)
        return
      }

      const tick = async () => {
        try {
          const [requests, accepted, sharers] = await Promise.all([
            listPendingRequests(userId),
            listAcceptedSince(userId, lastCursor),
            listNewSharersSince(userId, lastCursor),
          ])

          // Eventual consistency : seuls les événements plus récents que le
          // curseur sont notifiés ; on avance ensuite le curseur au « maintenant ».
          const now = Date.now()
          const events: NotificationEntry[] = buildEvents(
            requests,
            accepted,
            sharers,
            lastCursor
          )
          lastCursor = now

          if (events.length > 0) {
            const frame = { requests, events }
            send(`id: ${lastCursor}\ndata: ${JSON.stringify(frame)}\n\n`)
          } else if (now - lastPing >= KEEPALIVE_MS) {
            send(sseComment(`ping ${now}`))
            lastPing = now
          }
        } catch (err) {
          console.error("[notifications] tick échoué :", err)
        }
      }

      const interval = setInterval(() => void tick(), SAMPLE_MS)

      const onAbort = () => clearInterval(interval)
      request.signal.addEventListener("abort", onAbort, { once: true })

      // Ferme proprement le flux après TTL : le navigateur reconnecte avec
      // Last-Event-ID et reprend au curseur exact.
      setTimeout(() => {
        clearInterval(interval)
        try {
          controller.close()
        } catch {
          /* déjà fermé */
        }
      }, STREAM_TTL_MS)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}