"use client"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { cn } from "@/lib/utils"

export default function LocationSharingIndicator() {
  const { isSharing, error } = useLocationSharing()

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      title={error ?? undefined}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isSharing ? "animate-pulse bg-green-500" : "bg-gray-300"
        )}
      />
      {isSharing ? "Position partagée" : "Position privée"}
    </span>
  )
}