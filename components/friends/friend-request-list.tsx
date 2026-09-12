"use client"

import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { FriendRequest } from "@/lib/types/social"

interface FriendRequestListProps {
  requests: FriendRequest[]
  onAccept: (requestId: string) => Promise<void>
  onReject: (requestId: string) => Promise<void>
}

/** Une ligne de demande : identité, date, Accepter / Refuser. */
function RequestRow({
  request,
  pending,
  onAccept,
  onReject,
}: {
  request: FriendRequest
  pending: boolean
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border p-3">
      <Avatar>
        {request.fromImageUrl ? (
          <AvatarImage src={request.fromImageUrl} alt={request.fromName} />
        ) : (
          <AvatarFallback>{request.fromName[0]}</AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{request.fromName}</p>
        <p className="text-sm text-muted-foreground">
          Demandé le {request.createdAt.toLocaleDateString("fr-FR")}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={onAccept}>
          Accepter
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={onReject}>
          Refuser
        </Button>
      </div>
    </li>
  )
}

export default function FriendRequestList({
  requests,
  onAccept,
  onReject,
}: FriendRequestListProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  const run = async (requestId: string, action: (id: string) => Promise<void>) => {
    setPendingId(requestId)
    try {
      await action(requestId)
    } finally {
      setPendingId(null)
    }
  }

  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aucune demande en attente.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {requests.map((request) => (
        <RequestRow
          key={request.id}
          request={request}
          pending={pendingId === request.id}
          onAccept={() => void run(request.id, onAccept)}
          onReject={() => void run(request.id, onReject)}
        />
      ))}
    </ul>
  )
}
