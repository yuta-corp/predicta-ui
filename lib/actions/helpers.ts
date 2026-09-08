import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

/** Sélection minimale d'un profil utilisateur (listes amis, demandes). */
export const userProfileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
} as const

export function displayName(user: {
  firstName: string | null
  lastName: string | null
}): string {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || "Utilisateur"
}

/** Renvoie l'identifiant Clerk de la session, ou lève une erreur si absent. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Vous devez être connecté pour effectuer cette action.")
  }

  return userId
}

/**
 * Crée (ou met à jour) la ligne User locale depuis les données Clerk quand
 * elle manque. Les webhooks ne sont pas garantis (eventual consistency) :
 * on resynchronise donc à la demande, côté serveur uniquement.
 */
export async function ensureLocalUser(userId: string): Promise<void> {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  if (exists) return

  const clerkUser = await currentUser()
  if (!clerkUser) return

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      profileImageUrl: clerkUser.imageUrl,
    },
    update: {},
  })
}