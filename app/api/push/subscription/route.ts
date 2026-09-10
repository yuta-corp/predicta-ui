import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { ensureLocalUser } from "@/lib/actions/helpers"
import { removePushSubscription, savePushSubscription } from "@/lib/push/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SubscriptionBody {
  endpoint?: unknown
  keys?: { auth?: unknown; p256dh?: unknown }
}

/** Forme validée d'un abonnement prêt à être persisté. */
type ValidSubscription = {
  endpoint: string
  keys: { auth: string; p256dh: string }
}

/** Valide la forme d'un abonnement poussé par le navigateur. */
function parseSubscription(body: unknown): ValidSubscription | null {
  if (typeof body !== "object" || body === null) return null
  const { endpoint, keys } = body as SubscriptionBody
  if (
    typeof endpoint !== "string" ||
    !/^https:\/\//.test(endpoint) ||
    typeof keys !== "object" ||
    keys === null ||
    typeof keys.auth !== "string" ||
    typeof keys.p256dh !== "string" ||
    keys.auth.length === 0 ||
    keys.p256dh.length === 0
  ) {
    return null
  }
  return {
    endpoint,
    keys: { auth: keys.auth, p256dh: keys.p256dh },
  }
}

/** Enregistre l'abonnement push du navigateur courant. */
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const subscription = parseSubscription(await request.json().catch(() => null))
  if (!subscription) {
    return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 })
  }

  // L'utilisateur peut ne pas encore exister localement (webhook non reçu).
  await ensureLocalUser(userId)
  await savePushSubscription(userId, subscription)

  return NextResponse.json({ ok: true })
}

/** Révoque un abonnement push (désactivation côté client). */
export async function DELETE(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { endpoint?: string } | null
  const endpoint = body?.endpoint
  if (typeof endpoint !== "string") {
    return NextResponse.json({ error: "Endpoint manquant" }, { status: 400 })
  }

  await removePushSubscription(userId, endpoint)
  return NextResponse.json({ ok: true })
}