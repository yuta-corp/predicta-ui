"use client"

import { useState } from "react"
import { Check, MapPin, UserPlus, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { NotificationEntry, NotificationEntryKind } from "@/lib/notifications/events"
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/actions/friends"
import { formatRelativeTime } from "@/lib/format"
import type { FriendRequest } from "@/lib/types/social"

const KIND_ICON: Record<NotificationEntryKind, typeof MapPin> = {
  request: UserPlus,
  accepted: Check,
  sharing: MapPin,
}

interface RequestRowProps {
  request: FriendRequest
  busy: boolean
  onAccept: () => void
  onReject: () => void
}

/** Une demande : identité et boutons Accepter / Refuser. */
function RequestRow({ request, busy, onAccept, onReject }: RequestRowProps) {
  return (
    <li className="flex items-center gap-2.5">
      <Avatar className="h-7 w-7">
        {request.fromImageUrl ? (
          <AvatarImage src={request.fromImageUrl} alt={request.fromName} />
        ) : (
          <AvatarFallback className="text-xs">{request.fromName[0]}</AvatarFallback>
        )}
      </Avatar>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{request.fromName}</p>
      <Button
        size="icon-sm"
        aria-label={`Accepter la demande de ${request.fromName}`}
        disabled={busy}
        onClick={onAccept}
      >
        <Check className="h-3.5 w-3.5" aria-hidden />
      </Button>
      <Button
        size="icon-sm"
        variant="outline"
        aria-label={`Refuser la demande de ${request.fromName}`}
        disabled={busy}
        onClick={onReject}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </li>
  )
}

interface FriendRequestsListProps {
  requests: FriendRequest[]
  /** Appelé après acceptation ou refus, pour recharger le flux. */
  onChanged: () => void
}

/** Demandes d'amis en attente, avec Accepter / Refuser. */
export function FriendRequestsList({ requests, onChanged }: FriendRequestsListProps) {
  const [busyId, setBusyId] = useState<string | null>(null)

  const settle = async (request: FriendRequest, accept: boolean) => {
    setBusyId(request.id)
    try {
      if (accept) {
        await acceptFriendRequest(request.id)
        toast.success(`Demande de ${request.fromName} acceptée`)
      } else {
        await rejectFriendRequest(request.id)
        toast.success(`Demande de ${request.fromName} refusée`)
      }
      onChanged()
    } catch (err) {
      const fallback = accept
        ? "Impossible d'accepter la demande."
        : "Impossible de refuser la demande."
      toast.error(err instanceof Error ? err.message : fallback)
    } finally {
      setBusyId(null)
    }
  }

  if (requests.length === 0) return null

  return (
    <section aria-label="Demandes d'amis" className="border-b border-border pb-2.5">
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Demande{requests.length > 1 ? "s" : ""} d&apos;amis
      </h3>
      <ul className="space-y-2">
        {requests.map((request) => (
          <RequestRow
            key={request.id}
            request={request}
            busy={busyId === request.id}
            onAccept={() => void settle(request, true)}
            onReject={() => void settle(request, false)}
          />
        ))}
      </ul>
    </section>
  )
}

interface RecentNotificationsListProps {
  entries: NotificationEntry[]
  /** Horodatage courant : sert au calcul d'ancienneté relative. */
  now: number
  onOpen: (entry: NotificationEntry) => void
}

/** Activité récente, cliquable : on rejoint directement sa cible. */
export function RecentNotificationsList({
  entries,
  now,
  onOpen,
}: RecentNotificationsListProps) {
  return (
    <section aria-label="Activité récente">
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Récent
      </h3>
      {entries.length === 0 ? (
        <p className="py-3 text-center text-sm text-muted-foreground">
          Aucune notification pour le moment.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((entry) => {
            const Icon = KIND_ICON[entry.kind]
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onOpen(entry)}
                  className="flex w-full items-start gap-2 rounded-md px-1 py-1 text-left text-sm transition-colors hover:bg-muted"
                >
                  <Icon
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block">{entry.title}</span>
                    <time
                      dateTime={new Date(entry.createdAt).toISOString()}
                      className="block text-[11px] text-muted-foreground"
                    >
                      {formatRelativeTime(Math.max(0, now - entry.createdAt))}
                    </time>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
