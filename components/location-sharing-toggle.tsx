"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { toast } from "sonner"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

interface LocationSharingToggleProps {
  compact?: boolean
}

export default function LocationSharingToggle({
  compact = false,
}: LocationSharingToggleProps) {
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

  const label = isSharing
    ? "Désactiver le partage de position"
    : "Activer le partage de position"

  return (
    <Toggle
      pressed={isSharing}
      onPressedChange={handleToggle}
      disabled={isPending}
      aria-label={label}
      title={error ?? label}
      className={cn(compact && "h-7 w-7 p-0")}
    >
      {compact ? (
        <MapPin className="h-4 w-4" aria-hidden />
      ) : isSharing ? (
        "Partage actif"
      ) : (
        "Partager"
      )}
    </Toggle>
  )
}