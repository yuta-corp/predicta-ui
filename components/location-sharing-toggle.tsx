"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { Toggle } from "@/components/ui/toggle"

export default function LocationSharingToggle() {
  const { isSharing, error, startSharing, stopSharing } = useLocationSharing()
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async (pressed: boolean) => {
    setIsPending(true)
    try {
      if (pressed) {
        await startSharing()
        toast.success("Partage de position activé")
      } else {
        await stopSharing()
        toast.success("Partage de position désactivé")
      }
    } catch {
      toast.error("Impossible de modifier le partage de position")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Toggle
      pressed={isSharing}
      onPressedChange={handleToggle}
      disabled={isPending}
      aria-label={isSharing ? "Désactiver le partage de position" : "Activer le partage de position"}
      title={error ?? undefined}
    >
      {isSharing ? "Partage actif" : "Partager"}
    </Toggle>
  )
}