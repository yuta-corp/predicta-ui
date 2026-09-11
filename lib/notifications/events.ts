import type { FriendLocation, FriendRequest } from "@/lib/types/social"

export type NotificationEntryKind = "request" | "accepted" | "sharing"

export interface NotificationEntry {
  id: string
  kind: NotificationEntryKind
  title: string
  /**
   * Personne concernée par l'événement (identifiant Clerk). Cible du bouton
   * « Voir » : la position de cet ami pour un partage, la page amis pour une
   * demande ou une acceptation.
   */
  actorId: string
  /** Horodatage de l'événement (ms epoch) : ordre et ancienneté affichée. */
  createdAt: number
}

/** Types d'entrée acceptés — sert aussi à valider un état persisté. */
export const NOTIFICATION_ENTRY_KINDS: readonly NotificationEntryKind[] = [
  "request",
  "accepted",
  "sharing",
]

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

/*
 * Les entrées sont construites à partir de données minimales (et non d'un
 * objet de domaine complet) : le même constructeur sert au flux SSE et au push
 * — un seul libellé, un seul identifiant par événement, aucune dérive.
 */

/** Construit l'entrée « demande d'amis reçue ». */
export function requestEntry(input: {
  requestId: string
  fromUserId: string
  fromName: string
  createdAt: Date
}): NotificationEntry {
  return {
    id: `request:${input.requestId}`,
    kind: "request",
    actorId: input.fromUserId,
    createdAt: input.createdAt.getTime(),
    title: `${input.fromName} vous a envoyé une demande d'ami.`,
  }
}

/** Construit l'entrée « demande acceptée ». */
export function acceptedEntry(input: {
  friendId: string
  friendName: string
  acceptedAt: Date
}): NotificationEntry {
  return {
    id: `accepted:${input.friendId}:${input.acceptedAt.getTime()}`,
    kind: "accepted",
    actorId: input.friendId,
    createdAt: input.acceptedAt.getTime(),
    title: `${input.friendName} a accepté votre demande.`,
  }
}

/** Construit l'entrée « ami a commencé à partager sa position ». */
export function sharingEntry(input: {
  userId: string
  name: string
  startedAt: Date
}): NotificationEntry {
  return {
    id: `sharing:${input.userId}`,
    kind: "sharing",
    actorId: input.userId,
    createdAt: input.startedAt.getTime(),
    title: `${input.name} a commencé à partager sa position.`,
  }
}

/** Raccourci : entrée de partage depuis une position d'ami déjà chargée. */
export function sharingEntryFromLocation(location: FriendLocation): NotificationEntry {
  return sharingEntry({
    userId: location.userId,
    name: location.name,
    startedAt: location.updatedAt,
  })
}
