"use server"

import { ensureLocalUser, requireUserId, displayName, userProfileSelect } from "@/lib/actions/helpers"
import { prisma } from "@/lib/prisma"
import type { Friend, FriendRequest } from "@/lib/types/social"

/** Envoie une demande d'ami (requester = utilisateur courant). */
export async function sendFriendRequest(addresseeId: string): Promise<void> {
  const userId = await requireUserId()

  if (!addresseeId) {
    throw new Error("Identifiant d'utilisateur manquant.")
  }
  if (addresseeId === userId) {
    throw new Error("Vous ne pouvez pas vous envoyer une demande à vous-même.")
  }

  const target = await prisma.user.findUnique({
    where: { id: addresseeId },
    select: { id: true },
  })
  if (!target) {
    throw new Error("Cet utilisateur n'existe pas.")
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      status: { in: ["pending", "accepted"] },
      OR: [
        { requesterId: userId, addresseeId },
        { requesterId: addresseeId, addresseeId: userId },
      ],
    },
    select: { id: true },
  })
  if (existing) {
    throw new Error("Une demande est déjà en cours avec cet utilisateur.")
  }

  // Le demandeur peut ne pas encore exister localement (webhook non reçu).
  await ensureLocalUser(userId)

  await prisma.friendship.create({
    data: { requesterId: userId, addresseeId, status: "pending" },
  })
}

/** Accepte une demande reçue (addressee = utilisateur courant). */
export async function acceptFriendRequest(requestId: string): Promise<void> {
  const userId = await requireUserId()

  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { id: true, addresseeId: true, status: true },
  })

  if (!friendship || friendship.addresseeId !== userId) {
    throw new Error("Demande introuvable.")
  }
  if (friendship.status !== "pending") {
    throw new Error("Cette demande n'est plus en attente.")
  }

  await prisma.friendship.update({
    where: { id: requestId },
    data: { status: "accepted" },
  })
}

/** Refuse une demande reçue (statut passé à declined, ré-émission possible). */
export async function rejectFriendRequest(requestId: string): Promise<void> {
  const userId = await requireUserId()

  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { id: true, addresseeId: true, status: true },
  })

  if (!friendship || friendship.addresseeId !== userId) {
    throw new Error("Demande introuvable.")
  }
  if (friendship.status !== "pending") {
    throw new Error("Cette demande n'est plus en attente.")
  }

  await prisma.friendship.update({
    where: { id: requestId },
    data: { status: "declined" },
  })
}

/** Retire un ami (relation accepted, dans les deux sens). */
export async function removeFriend(friendshipId: string): Promise<void> {
  const userId = await requireUserId()

  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
    select: { id: true, requesterId: true, addresseeId: true, status: true },
  })

  if (
    !friendship ||
    (friendship.requesterId !== userId && friendship.addresseeId !== userId)
  ) {
    throw new Error("Relation introuvable.")
  }
  if (friendship.status !== "accepted") {
    throw new Error("Cette relation n'est pas active.")
  }

  await prisma.friendship.delete({ where: { id: friendshipId } })
}

/** Liste les amis acceptés (dans les deux sens), du plus récent au plus ancien. */
export async function listFriends(): Promise<Friend[]> {
  const userId = await requireUserId()

  const rows = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: {
      id: true,
      createdAt: true,
      requester: { select: userProfileSelect },
      addressee: { select: userProfileSelect },
    },
    orderBy: { createdAt: "desc" },
  })

  return rows.map((row) => {
    const other = row.requester.id === userId ? row.addressee : row.requester
    return {
      friendshipId: row.id,
      userId: other.id,
      name: displayName(other),
      imageUrl: other.profileImageUrl,
      since: row.createdAt,
    }
  })
}

/** Liste les demandes reçues en attente. */
export async function listFriendRequests(): Promise<FriendRequest[]> {
  const userId = await requireUserId()

  const rows = await prisma.friendship.findMany({
    where: { addresseeId: userId, status: "pending" },
    select: {
      id: true,
      createdAt: true,
      requester: { select: userProfileSelect },
    },
    orderBy: { createdAt: "desc" },
  })

  return rows.map((row) => ({
    id: row.id,
    fromUserId: row.requester.id,
    fromName: displayName(row.requester),
    fromImageUrl: row.requester.profileImageUrl,
    createdAt: row.createdAt,
  }))
}