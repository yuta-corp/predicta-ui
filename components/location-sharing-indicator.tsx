"use client"

import { useUser } from "@clerk/nextjs"

import { useLocationSharing } from "@/components/location-sharing-provider"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface LocationSharingIndicatorProps {
  compact?: boolean
}

/**
 * Badge de géolocalisation de l'utilisateur courant : la photo de profil
 * (pdp) qui pulse quand le partage est actif, grisée sinon. Le petit point en
 * bas à droite traduit l'état en permanence.
 */
export default function LocationSharingIndicator({
  compact = false,
}: LocationSharingIndicatorProps) {
  const { isSharing, error } = useLocationSharing()
  const { user } = useUser()
  const label = isSharing ? "Position partagée" : "Position privée"
  const fallback = user?.firstName?.[0] ?? user?.username?.[0] ?? "?"

  const avatar = (
    <span className="relative inline-flex shrink-0">
      {isSharing && (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-green-500/50"
          aria-hidden
        />
      )}
      <Avatar size="sm" className="ring-2 ring-background">
        {user?.imageUrl ? (
          <AvatarImage src={user.imageUrl} alt={label} />
        ) : (
          <AvatarFallback>{fallback}</AvatarFallback>
        )}
      </Avatar>
      <AvatarBadge
        className={cn(isSharing ? "bg-green-500" : "bg-gray-300")}
        aria-hidden
      />
    </span>
  )

  if (compact) {
    return (
      <span title={error ?? label} aria-label={label}>
        {avatar}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      title={error ?? undefined}
    >
      {avatar}
      {label}
    </span>
  )
}