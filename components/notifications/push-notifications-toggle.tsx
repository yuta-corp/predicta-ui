"use client"

import { BellRing } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushPermissionState,
  isPushSupported,
} from "@/lib/push/client"

/**
 * Opt-in aux notifications système (Web Push). État local synchronisé avec la
 * permission navigateur. L'activation demande la permission (geste utilisateur)
 * puis enregistre l'abonnement côté serveur.
 */
export function PushNotificationsToggle() {
  const [enabled, setEnabled] = useState(
    () => getPushPermissionState() === "granted"
  )
  const [busy, setBusy] = useState(false)
  const [supported] = useState(() => isPushSupported())

  const toggle = useCallback(async (on: boolean) => {
    setBusy(true)
    try {
      const state = on
        ? await enablePushNotifications()
        : await disablePushNotifications()
      setEnabled(state === "granted")
      if (on && state === "denied") {
        toast("Notifications bloquées dans votre navigateur.")
      }
    } finally {
      setBusy(false)
    }
  }, [])

  if (!supported) return null

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pt-2 pb-3">
      <div className="flex items-center gap-2 text-sm">
        <BellRing className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="font-medium">Notifications système</span>
      </div>
      <Switch
        checked={enabled}
        disabled={busy}
        aria-label="Activer les notifications système"
        onCheckedChange={(value) => void toggle(value)}
      />
    </div>
  )
}