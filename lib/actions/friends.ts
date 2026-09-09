"use server"

import { ensureLocalUser, requireUserId, displayName, userProfileSelect } from "@/lib/actions/helpers"
import { prisma } from "@/lib/prisma"
import { pushPayloadFromEntry, sendPushToUser } from "@/lib/push/server"
import type {
  Friend,
  FriendRequest,
  MyProfile,
  UserSearchResult,
} from "@/lib/types/social"

const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/

/** Définit (ou remplace) le pseudo de l'utilisateur courant. */
export async function setUsername(username: string): Promise<void> {
  const userId = await requireUserId()
  await ensureLocalUser(userId)

  const value = username.trim()
  if (!USERNAME_REGEX.test(value)) {
    throw new Error("Pseudo invalide : 3 à 20 caractères (lettres, chiffres, . _ -).")
  }

  const existing = await prisma.user.findUnique({
    where: { username: value },
    select: { id: true },
  })
  if (existing && existing.id !== userId) {
    throw new Error("Ce pseudo est déjà utilisé.")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username: value },
  })
}

/** Profil local de l'utilisateur courant (inclut le pseudo), ou null. */
export async function getMyProfile(): Promise<MyProfile | null> {
  const userId = await requireUserId()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImageUrl: true,
    },
  })

  return user
}

/**
 * Recherche d'utilisateurs par pseudo (ou nom) pour envoyer une demande.
 * Exclut soi-même et les utilisateurs avec qui une relation existe déjà.
 */
export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const userId = await requireUserId()

  const q = query.trim()
  if (!q) return []

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ],
    },
    select: userProfileSelect,
    take: 12,
  })

  const candidates = users.filter((user) => user.id !== userId)
  if (candidates.length === 0) return []

  const related = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: userId, addresseeId: { in: candidates.map((u) => u.id) } },
        { requesterId: { in: candidates.map((u) => u.id) }, addresseeId: userId },
      ],
    },
    select: { requesterId: true, addresseeId: true },
  })
  const relatedIds = new Set(
    related.map((row) =>
      row.requesterId === userId ? row.addresseeId : row.requesterId
    )
  )

  return candidates
    .filter((user) => !relatedIds.has(user.id))
    .map((user) => ({
      id: user.id,
      username: user.username,
      name: displayName(user),
      imageUrl: user.profileImageUrl,
    }))
}

/** Envoie une demande d'ami (requester = utilisateur courant). */
export async function sendFriendRequest(addresseeId: string): Promise<void> {
  const userId = await requireUserId()

  if (!addresseeId?.trim()) {
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

  const friendship = await prisma.friendship.create({
    data: { requesterId: userId, addresseeId, status: "pending" },
  })

  await notifyFriendRequestCreated(userId, addresseeId, friendship.id)
}

/** Push « demande d'ami reçue » à l'attention du destinataire. */
async function notifyFriendRequestCreated(
  requesterId: string,
  addresseeId: string,
  friendshipId: string
) {
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
    select: userProfileSelect,
  })
  if (!requester) return

  await sendPushToUser(
    addresseeId,
    pushPayloadFromEntry({
      id: `request:${friendshipId}`,
      kind: "request",
      title: `${displayName(requester)} vous a envoyé une demande d'ami.`,
    })
  )
}

/** Accepte une demande reçue (addressee = utilisateur courant). */
export async function acceptFriendRequest(requestId: string): Promise<void> {
  const userId = await requireUserId()

  const friendship = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { id: true, requesterId: true, addresseeId: true, status: true },
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

  await notifyRequestAccepted(userId, friendship.requesterId, friendship.id)
}

/** Push « demande acceptée » à l'attention du demandeur. */
async function notifyRequestAccepted(addresseeId: string, requesterId: string, friendshipId: string) {
  const addressee = await prisma.user.findUnique({
    where: { id: addresseeId },
    select: userProfileSelect,
  })
  if (!addressee) return

  await sendPushToUser(
    requesterId,
    pushPayloadFromEntry({
      id: `accepted:${friendshipId}`,
      kind: "accepted",
      title: `${displayName(addressee)} a accepté votre demande.`,
    })
  )
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