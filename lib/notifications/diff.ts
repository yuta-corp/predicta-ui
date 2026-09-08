import type { AcceptedFriendRequest, FriendLocation, FriendRequest } from "@/lib/types/social"

/** Clé de stabilité d'une demande acceptée (l'ami peut être re-ajouté plus tard). */
export function acceptedKey(accepted: AcceptedFriendRequest): string {
  return `${accepted.friendId}:${accepted.acceptedAt.getTime()}`
}

/** Demandes d'amis reçues non encore vues (ids `seenIds`). */
export function diffIncomingRequests(
  seenIds: ReadonlySet<string>,
  next: FriendRequest[]
): FriendRequest[] {
  return next.filter((request) => !seenIds.has(request.id))
}

/** Demandes sortantes acceptées non encore notifiées (clés `seenKeys`). */
export function diffAcceptedRequests(
  seenKeys: ReadonlySet<string>,
  next: AcceptedFriendRequest[]
): AcceptedFriendRequest[] {
  return next.filter((accepted) => !seenKeys.has(acceptedKey(accepted)))
}

/** Amis qui viennent d'apparaître comme partageurs (ids `seenUserIds`). */
export function diffNewSharers(
  seenUserIds: ReadonlySet<string>,
  next: FriendLocation[]
): FriendLocation[] {
  return next.filter((location) => !seenUserIds.has(location.userId))
}