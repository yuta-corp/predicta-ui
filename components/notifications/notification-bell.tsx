"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, MapPin, UserPlus, X } from "lucide-react"
import { toast } from "sonner"

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
import { PushNotificationsToggle } from "@/components/notifications/push-notifications-toggle"
import { acceptFriendRequest, rejectFriendRequest } from "@/lib/actions/friends"
import { formatRelativeTime } from "@/lib/format"
import { openNotification } from "@/lib/notifications/open"

const KIND_ICON: Record<NotificationEntryKind, typeof MapPin> = {
  request: UserPlus,
  accepted: Check,
  sharing: MapPin,
}

/** Fraîchissement de l'ancienneté affichée pendant que le panneau est ouvert. */
const AGE_TICK_MS = 30_000

/**
 * Cloche de notifications : badge = demandes d'amis en attente ; le panneau
 * liste les demandes (Accepter/Refuser) et l'activité récente — persistée,
 * cliquable pour rejoindre directement la position d'un ami.
 */
export function NotificationBell() {
  const { requests, recent, refresh } = useNotifications()
  const router = useRouter()
  const count = requests.length

  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null)

  // L'ancienneté n'est rafraîchie que lorsque le panneau est ouvert.
  useEffect(() => {
    if (!open) return
    const timer = setInterval(() => setNow(Date.now()), AGE_TICK_MS)
    return () => clearInterval(timer)
  }, [open])

  const handleAccept = async (requestId: string, fromName: string) => {
    setBusyRequestId(requestId)
    try {
      await acceptFriendRequest(requestId)
      toast.success(`Demande de ${fromName} acceptée`)
      refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'accepter la demande."
      )
    } finally {
      setBusyRequestId(null)
    }
  }

  const handleReject = async (requestId: string, fromName: string) => {
    setBusyRequestId(requestId)
    try {
      await rejectFriendRequest(requestId)
      toast.success(`Demande de ${fromName} refusée`)
      refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de refuser la demande."
      )
    } finally {
      setBusyRequestId(null)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setNow(Date.now())
        setOpen(next)
      }}
    >
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

        <PushNotificationsToggle />

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
                    disabled={busyRequestId === request.id}
                    onClick={() => void handleAccept(request.id, request.fromName)}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    aria-label={`Refuser la demande de ${request.fromName}`}
                    disabled={busyRequestId === request.id}
                    onClick={() => void handleReject(request.id, request.fromName)}
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
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        openNotification(entry, router.push)
                      }}
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
      </PopoverContent>
    </Popover>
  )
}
