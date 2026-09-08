"use client"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { cn } from "@/lib/utils"

interface LocationSharingIndicatorProps {
  compact?: boolean
}

export default function LocationSharingIndicator({
  compact = false,
}: LocationSharingIndicatorProps) {
  const { isSharing, error } = useLocationSharing()
  const label = isSharing ? "Position partagée" : "Position privée"

  if (compact) {
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
        title={error ?? label}
        aria-label={label}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            isSharing ? "animate-pulse bg-green-500" : "bg-gray-300"
          )}
        />
      </span>
    )
  }

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
      {label}
    </span>
  )
}