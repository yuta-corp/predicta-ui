"use server"

import { randomBytes } from "node:crypto"

import {
  ensureLocalUser,
  getAcceptedFriendIds,
  requireUserId,
  displayName,
  userProfileSelect,
} from "@/lib/actions/helpers"
import { prisma } from "@/lib/prisma"
import type { FriendLocation, SharedLocation } from "@/lib/types/social"

/** Une position plus vieille que ce délai est considérée comme périmée. */
const LOCATION_TTL_MS = 5 * 60_000

/** Durée de vie d'un lien de partage (révocable à tout moment par ailleurs). */
const LINK_TTL_MS = 24 * 60 * 60 * 1000

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

/**
 * Remplace la liste des amis autorisés à me voir. Seuls les amis acceptés
 * peuvent être ajoutés (un non-ami ne peut jamais devenir viewer).
 * La sélection est conservée (les lignes ne sont pas supprimées à l'arrêt
 * du partage), ce qui permet de préconfigurer « avec qui » avant de partager.
 */
export async function setShareViewers(viewerIds: string[]): Promise<void> {
  const userId = await requireUserId()
  await ensureLocalUser(userId)

  const friendIds = new Set(await getAcceptedFriendIds(userId))
  const allowed = [...new Set(viewerIds)].filter(
    (id) => id !== userId && friendIds.has(id)
  )

  await prisma.$transaction(async (tx) => {
    await tx.locationShareViewer.deleteMany({ where: { shareUserId: userId } })
    if (allowed.length > 0) {
      await tx.locationShareViewer.createMany({
        data: allowed.map((viewerUserId) => ({
          shareUserId: userId,
          viewerUserId,
        })),
      })
    }
  })
}

/** Renvoie les ids des amis actuellement autorisés à me voir. */
export async function getShareViewers(): Promise<string[]> {
  const userId = await requireUserId()

  const rows = await prisma.locationShareViewer.findMany({
    where: { shareUserId: userId },
    select: { viewerUserId: true },
  })

  return rows.map((row) => row.viewerUserId)
}

/**
 * Positions fraîches des amis acceptés qui m'ont explicitement autorisé à les
 * voir (partage ciblé : l'absence d'autorisation masque la position, même
 * entre amis).
 */
export async function getFriendsLocations(): Promise<FriendLocation[]> {
  const userId = await requireUserId()

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

/** Crée (ou réutilise) le lien secret du partage par lien de l'utilisateur. */
export async function createLocationLink(): Promise<string> {
  const userId = await requireUserId()
  await ensureLocalUser(userId)

  const existing = await prisma.locationShareLink.findFirst({
    where: { userId },
    select: { token: true },
  })
  if (existing) return existing.token

  const token = randomBytes(24).toString("hex")
  const expiresAt = new Date(Date.now() + LINK_TTL_MS)
  await prisma.locationShareLink.create({ data: { token, userId, expiresAt } })
  return token
}

/** Renvoie le token du lien de partage courant, ou null. */
export async function getMyLocationLink(): Promise<string | null> {
  const userId = await requireUserId()

  const link = await prisma.locationShareLink.findFirst({
    where: { userId },
    select: { token: true },
  })

  return link?.token ?? null
}

/** Révoque le lien de partage (le token devient inutilisable). */
export async function revokeLocationLink(token: string): Promise<void> {
  const userId = await requireUserId()
  if (!token) return

  await prisma.locationShareLink.deleteMany({ where: { userId, token } })
}

/**
 * Position partagée consultable via l'URL `/share/:token`. Exige d'être
 * authentifié (Clerk) — le token est le secret, pas un accès public.
 * Renvoie null si le lien n'existe plus / a expiré, si le partage est arrêté
 * ou si la position est périmée.
 */
export async function getSharedLocation(token: string): Promise<SharedLocation | null> {
  await requireUserId()
  if (!token) return null

  const link = await prisma.locationShareLink.findUnique({
    where: { token },
    select: {
      userId: true,
      expiresAt: true,
      user: { select: userProfileSelect },
    },
  })
  if (!link) return null
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) return null

  const share = await prisma.locationShare.findUnique({
    where: { userId: link.userId },
    select: { latitude: true, longitude: true, accuracy: true, updatedAt: true },
  })
  if (!share) return null
  if (Date.now() - share.updatedAt.getTime() > LOCATION_TTL_MS) return null

  return {
    sharerName: displayName(link.user),
    sharerImageUrl: link.user.profileImageUrl,
    latitude: share.latitude,
    longitude: share.longitude,
    accuracy: share.accuracy,
    updatedAt: share.updatedAt,
  }
}