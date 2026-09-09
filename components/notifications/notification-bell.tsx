"use client"

import { Bell, Check, MapPin, UserPlus, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  useNotifications,
  type NotificationEntryKind,
} from "@/components/notifications-provider"
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/actions/friends"

const KIND_ICON: Record<NotificationEntryKind, typeof MapPin> = {
  request: UserPlus,
  accepted: Check,
  sharing: MapPin,
}

/**
 * Cloche de notifications dans l'en-tête : badge = demandes d'amis en attente ;
 * le panneau liste les demandes (Accepter/Refuser) et l'activité récente.
 */
export function NotificationBell() {
  const { requests, recent, refresh } = useNotifications()
  const count = requests.length

  const handleAccept = async (requestId: string) => {
    await acceptFriendRequest(requestId)
    refresh()
  }

  const handleReject = async (requestId: string) => {
    await rejectFriendRequest(requestId)
    refresh()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={
            count > 0
              ? `${count} demande${count > 1 ? "s" : ""} d'ami en attente`
              : "Notifications"
          }
          className="relative inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-[70vh] w-80 overflow-y-auto">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
        </PopoverHeader>

        {count > 0 && (
          <section aria-label="Demandes d'amis" className="border-b border-border pb-2.5">
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Demande{count > 1 ? "s" : ""} d&apos;amis
            </h3>
            <ul className="space-y-2">
              {requests.map((request) => (
                <li key={request.id} className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7">
                    {request.fromImageUrl ? (
                      <AvatarImage src={request.fromImageUrl} alt={request.fromName} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {request.fromName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">
                    {request.fromName}
                  </p>
                  <Button
                    size="icon-sm"
                    aria-label={`Accepter la demande de ${request.fromName}`}
                    onClick={() => void handleAccept(request.id)}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label={`Refuser la demande de ${request.fromName}`}
                    onClick={() => void handleReject(request.id)}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Activité récente">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Récent
          </h3>
          {recent.length === 0 ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recent.map((entry) => {
                const Icon = KIND_ICON[entry.kind]
                return (
                  <li key={entry.id} className="flex items-start gap-2 text-sm">
                    <Icon
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="min-w-0">{entry.title}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </PopoverContent>
    </Popover>
  )
}