import { getAcceptedFriendIds, displayName, userProfileSelect } from "@/lib/actions/helpers"
import {
  acceptedEntry,
  requestEntry,
  sharingEntry,
  type NotificationEntry,
} from "@/lib/notifications/events"
import { prisma } from "@/lib/prisma"
import type {
  AcceptedFriendRequest,
  FriendLocation,
  FriendRequest,
} from "@/lib/types/social"

/** Une position plus vieille que ce délai est considérée comme périmée. */
const LOCATION_TTL_MS = 5 * 60_000

/**
 * Service serveur du flux SSE /api/notifications. Consomme un curseur (ms
 * epoch) : seuls les événements strictement plus récents que le curseur sont
 * renvoyés — le client reprend là où il s'est arrêté après une reconnexion.
 *
 * Trois familles d'événements, toutes détectables par timestamp :
 * - demandes d'amis reçues (`createdAt`)
 * - demandes sortantes acceptées (`updatedAt` de la relation)
 * - amis qui commencent (ou recommencent) à partager leur position
 *   (`LocationShare.startedAt` : fixé au démarrage d'une session, jamais
 *   avancé par le rafraîchissement périodique — sinon chaque mise à jour
 *   de position déclencherait une notification).
 */

export async function listPendingRequests(userId: string): Promise<FriendRequest[]> {
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

export async function listAcceptedSince(
  userId: string,
  sinceMs: number
): Promise<AcceptedFriendRequest[]> {
  const rows = await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: "accepted",
      updatedAt: { gt: new Date(sinceMs) },
    },
    select: {
      id: true,
      updatedAt: true,
      addressee: { select: userProfileSelect },
    },
    orderBy: { updatedAt: "desc" },
    take: 30,
  })

  return rows.map((row) => ({
    id: row.id,
    friendId: row.addressee.id,
    friendName: displayName(row.addressee),
    friendImageUrl: row.addressee.profileImageUrl,
    acceptedAt: row.updatedAt,
  }))
}

export async function listNewSharersSince(
  userId: string,
  sinceMs: number
): Promise<FriendLocation[]> {
  const friendIds = await getAcceptedFriendIds(userId)
  if (friendIds.length === 0) return []

  const viewerRows = await prisma.locationShareViewer.findMany({
    where: { viewerUserId: userId },
    select: { shareUserId: true },
  })
  const allowedByShare = new Set(viewerRows.map((row) => row.shareUserId))
  const allowedFriendIds = friendIds.filter((id) => allowedByShare.has(id))
  if (allowedFriendIds.length === 0) return []

  const cutoff = new Date(Date.now() - LOCATION_TTL_MS)
  const shares = await prisma.locationShare.findMany({
    where: {
      userId: { in: allowedFriendIds },
      updatedAt: { gt: cutoff },
      startedAt: { gt: new Date(sinceMs) },
    },
    select: {
      userId: true,
      latitude: true,
      longitude: true,
      accuracy: true,
      updatedAt: true,
      user: { select: userProfileSelect },
    },
  })

  return shares.map((share) => ({
    userId: share.userId,
    name: displayName(share.user),
    imageUrl: share.user.profileImageUrl,
    latitude: share.latitude,
    longitude: share.longitude,
    accuracy: share.accuracy,
    updatedAt: share.updatedAt,
  }))
}

/** Fabrique les entrées de notification à partir des données brutes. */
export function buildEvents(
  requests: FriendRequest[],
  accepted: AcceptedFriendRequest[],
  sharers: FriendLocation[],
  sinceMs: number
): NotificationEntry[] {
  const events: NotificationEntry[] = []

  for (const request of requests) {
    if (request.createdAt.getTime() > sinceMs) events.push(requestEntry(request))
  }
  for (const item of accepted) {
    if (item.acceptedAt.getTime() > sinceMs) events.push(acceptedEntry(item))
  }
  for (const sharer of sharers) events.push(sharingEntry(sharer))

  return events
}