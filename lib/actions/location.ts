"use server"

import { ensureLocalUser, requireUserId, displayName } from "@/lib/actions/helpers"
import { prisma } from "@/lib/prisma"
import type { FriendLocation } from "@/lib/types/social"

/** Une position plus vieille que ce délai est considérée comme périmée. */
const LOCATION_TTL_MS = 5 * 60_000

function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90
}

function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180
}

/** Publie (upsert) la dernière position partagée de l'utilisateur courant. */
export async function updateLocation(
  latitude: number,
  longitude: number,
  accuracy?: number
): Promise<void> {
  const userId = await requireUserId()

  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    throw new Error("Coordonnées invalides.")
  }

  // L'utilisateur peut ne pas encore exister localement (webhook non reçu).
  await ensureLocalUser(userId)

  await prisma.locationShare.upsert({
    where: { userId },
    create: { userId, latitude, longitude, accuracy: accuracy ?? null },
    update: { latitude, longitude, accuracy: accuracy ?? null },
  })
}

/** Arrête le partage : la ligne de position est supprimée immédiatement. */
export async function stopLocationSharing(): Promise<void> {
  const userId = await requireUserId()

  await prisma.locationShare.deleteMany({ where: { userId } })
}

/** Positions fraîches des amis acceptés (uniquement). */
export async function getFriendsLocations(): Promise<FriendLocation[]> {
  const userId = await requireUserId()

  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  })

  const friendIds = friendships.map((row) =>
    row.requesterId === userId ? row.addresseeId : row.requesterId
  )
  if (friendIds.length === 0) return []

  const cutoff = new Date(Date.now() - LOCATION_TTL_MS)
  const shares = await prisma.locationShare.findMany({
    where: {
      userId: { in: friendIds },
      updatedAt: { gt: cutoff },
    },
    select: {
      userId: true,
      latitude: true,
      longitude: true,
      accuracy: true,
      updatedAt: true,
      user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
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