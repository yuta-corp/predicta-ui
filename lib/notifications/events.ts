import type {
  AcceptedFriendRequest,
  FriendLocation,
  FriendRequest,
} from "@/lib/types/social"

export type NotificationEntryKind = "request" | "accepted" | "sharing"

export interface NotificationEntry {
  id: string
  kind: NotificationEntryKind
  title: string
}

export interface NotificationSnapshot {
  type: "snapshot"
  /** Demandes d'amis reçues en attente (alimente le badge de la cloche). */
  requests: FriendRequest[]
}

export interface NotificationTick {
  type: "tick"
  /** Demandes reçues toujours en attente (badge à jour). */
  requests: FriendRequest[]
  /** Nouveaux événements depuis le dernier curseur. */
  events: NotificationEntry[]
}

/** Construit l'entrée « demande d'amis reçue ». */
export function requestEntry(request: FriendRequest): NotificationEntry {
  return {
    id: `request:${request.id}`,
    kind: "request",
    title: `${request.fromName} vous a envoyé une demande d'ami.`,
  }
}

/** Construit l'entrée « demande acceptée ». */
export function acceptedEntry(accepted: AcceptedFriendRequest): NotificationEntry {
  return {
    id: `accepted:${accepted.friendId}:${accepted.acceptedAt.getTime()}`,
    kind: "accepted",
    title: `${accepted.friendName} a accepté votre demande.`,
  }
}

/** Construit l'entrée « ami a commencé à partager sa position ». */
export function sharingEntry(location: FriendLocation): NotificationEntry {
  return {
    id: `sharing:${location.userId}`,
    kind: "sharing",
    title: `${location.name} a commencé à partager sa position.`,
  }
}