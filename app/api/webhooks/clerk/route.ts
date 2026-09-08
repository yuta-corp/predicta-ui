import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextResponse, type NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"

/**
 * Webhook Clerk — synchronise les comptes Clerk vers la table `users`
 * locale (Prisma). La signature est vérifiée avec `verifyWebhook` et le
 * secret `CLERK_WEBHOOK_SIGNING_SECRET` (Clerk Dashboard → Webhooks).
 *
 * Reste une route API (et non une server action) car Clerk POSTe dessus
 * depuis l'extérieur.
 */
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data

        await prisma.user.upsert({
          where: { id },
          create: {
            id,
            email: email_addresses[0]?.email_address ?? null,
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            profileImageUrl: image_url ?? null,
          },
          update: {
            email: email_addresses[0]?.email_address ?? null,
            firstName: first_name ?? null,
            lastName: last_name ?? null,
            profileImageUrl: image_url ?? null,
          },
        })
        break
      }

      case "user.deleted": {
        const { id } = evt.data
        if (id) {
          // Les friendships et positions partagées sont supprimées en cascade.
          await prisma.user.delete({ where: { id } }).catch(() => {
            // L'utilisateur peut ne pas exister localement (webhook jamais reçu).
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook Clerk invalide :", error)
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 })
  }
}