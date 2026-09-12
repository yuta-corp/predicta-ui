"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"

import { useNotifications } from "@/components/notifications-provider"
import {
  FriendRequestsList,
  RecentNotificationsList,
} from "@/components/notifications/notification-lists"
import { PushNotificationsToggle } from "@/components/notifications/push-notifications-toggle"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { openNotification } from "@/lib/notifications/open"

/** Fraîchissement de l'ancienneté affichée pendant que le panneau est ouvert. */
const AGE_TICK_MS = 30_000

/** Bouton de la cloche : icône + badge des demandes en attente. */
function BellTrigger({ count }: { count: number }) {
  const label =
    count > 0
      ? `${count} demande${count > 1 ? "s" : ""} d'ami en attente`
      : "Notifications"
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label={label}
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
  )
}

/**
 * Cloche de notifications : badge = demandes d'amis en attente ; le panneau
 * liste les demandes (Accepter/Refuser) et l'activité récente — persistée,
 * cliquable pour rejoindre directement la position d'un ami.
 */
export function NotificationBell() {
  const { requests, recent, refresh } = useNotifications()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  // L'ancienneté n'est rafraîchie que lorsque le panneau est ouvert.
  useEffect(() => {
    if (!open) return
    const timer = setInterval(() => setNow(Date.now()), AGE_TICK_MS)
    return () => clearInterval(timer)
  }, [open])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setNow(Date.now())
        setOpen(next)
      }}
    >
      <BellTrigger count={requests.length} />
      <PopoverContent align="end" className="max-h-[70vh] w-80 overflow-y-auto">
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
        </PopoverHeader>

        <PushNotificationsToggle />
        <FriendRequestsList requests={requests} onChanged={refresh} />
        <RecentNotificationsList
          entries={recent}
          now={now}
          onOpen={(entry) => {
            setOpen(false)
            openNotification(entry, router.push)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
