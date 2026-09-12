import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"

import {
  buildEvents,
  listAcceptedSince,
  listNewSharersSince,
  listPendingRequests,
} from "@/lib/notifications/server-service"
import type {
  NotificationEntry,
  NotificationSnapshot,
  NotificationTick,
} from "@/lib/notifications/events"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Intervalle d'échantillonnage des nouvelles notifications (serveur). */
const SAMPLE_MS = 8_000

/**
 * Durée de vie du flux. Sur Vercel serverless, un flux fermé proprement puis
 * reconnecté via `Last-Event-ID` est plus robuste (et moins coûteux) qu'un flux
 * éternel : l'EventSource reprend au curseur exact où le précédent s'est arrêté.
 */
const STREAM_TTL_MS = 45_000

/** Keep-alive SSE si aucune notification n'est envoyée pendant ce délai. */
const KEEPALIVE_MS = 20_000

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const

/** Encadre un message SSE (id + data). */
export function sseFrame(id: number, payload: unknown): string {
  return `id: ${id}\ndata: ${JSON.stringify(payload)}\n\n`
}

/** Encadre un commentaire SSE (rôle keep-alive). */
export function sseComment(line: string): string {
  return `: ${line}\n\n`
}

/**
 * Curseur de reprise : Last-Event-ID renvoyé par le navigateur, sinon le
 * paramètre `cursor`, sinon maintenant (premier contact = aucune notification
 * rétroactive).
 */
function resolveCursor(request: NextRequest): number {
  const resumed =
    Number(request.headers.get("last-event-id")) ||
    Number(request.nextUrl.searchParams.get("cursor"))
  return Number.isFinite(resumed) && resumed > 0 ? resumed : Date.now()
}

interface StreamContext {
  controller: ReadableStreamDefaultController<Uint8Array>
  encoder: TextEncoder
  userId: string
  cursor: number
  signal: AbortSignal
}

/**
 * Boucle d'échantillonnage : ticks séquentiels (la passe suivante n'est
 * planifiée qu'après la précédente — jamais de chevauchement, le curseur reste
 * cohérent même si une requête DB est lente).
 */
function createStreamTicker(ctx: StreamContext, send: (message: string) => void) {
  let lastCursor = ctx.cursor
  let lastPing = Date.now()
  let tickTimer: ReturnType<typeof setTimeout> | undefined
  let closed = false

  const tick = async () => {
    if (closed) return
    try {
      const [requests, accepted, sharers] = await Promise.all([
        listPendingRequests(ctx.userId),
        listAcceptedSince(ctx.userId, lastCursor),
        listNewSharersSince(ctx.userId, lastCursor),
      ])
      const now = Date.now()
      const events: NotificationEntry[] = buildEvents(
        requests,
        accepted,
        sharers,
        lastCursor
      )
      lastCursor = now

      if (events.length > 0) {
        const frame: NotificationTick = { type: "tick", requests, events }
        send(sseFrame(lastCursor, frame))
      } else if (now - lastPing >= KEEPALIVE_MS) {
        send(sseComment(`ping ${now}`))
        lastPing = now
      }
    } catch (err) {
      console.error("[notifications] tick échoué :", err)
    } finally {
      if (!closed) tickTimer = setTimeout(() => void tick(), SAMPLE_MS)
    }
  }

  return {
    stop: () => {
      if (tickTimer) clearTimeout(tickTimer)
      tickTimer = undefined
      closed = true
    },
    start: () => {
      tickTimer = setTimeout(() => void tick(), SAMPLE_MS)
    },
  }
}

/** Snapshot initial, puis ticker + fermeture propre (abandon ou TTL). */
async function runStream(ctx: StreamContext): Promise<void> {
  const { controller, encoder, userId } = ctx
  const send = (message: string) => {
    try {
      controller.enqueue(encoder.encode(message))
    } catch (err) {
      console.error("[notifications] envoi SSE échoué :", err)
    }
  }

  // Premier message : état courant (badge des demandes en attente).
  try {
    const pending = await listPendingRequests(userId)
    const snapshot: NotificationSnapshot = { type: "snapshot", requests: pending }
    send(sseFrame(ctx.cursor, snapshot))
  } catch (err) {
    console.error("[notifications] snapshot initial échoué :", err)
    controller.error(err)
    return
  }

  const ticker = createStreamTicker(ctx, send)
  const onAbort = () => {
    ticker.stop()
    try {
      controller.close()
    } catch {
      /* déjà fermé */
    }
  }
  ctx.signal.addEventListener("abort", onAbort, { once: true })

  // Ferme proprement après TTL : le navigateur reconnecte avec Last-Event-ID.
  setTimeout(onAbort, STREAM_TTL_MS)
  ticker.start()
}

/**
 * SSE push des notifications : le serveur sample la base toutes les 8 s et
 * pousse les nouveaux événements (demandes reçues, acceptations, nouveaux
 * partageurs). Chaque message porte un `id:` (curseur ms) : l'API EventSource
 * le renvoie en `Last-Event-ID` à la reconnexion, rien n'est perdu ni dupliqué.
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return new Response("Non autorisé", { status: 401 })

  const encoder = new TextEncoder()
  const cursor = resolveCursor(request)

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      void runStream({
        controller,
        encoder,
        userId,
        cursor,
        signal: request.signal,
      })
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}
