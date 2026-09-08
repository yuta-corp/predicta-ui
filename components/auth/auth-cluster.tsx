"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"

import CustomSignInButton from "@/components/auth/sign-in-button"
import CustomUserMenu from "@/components/auth/user-menu"
import LocationSharingIndicator from "@/components/location-sharing-indicator"
import LocationSharingToggle from "@/components/location-sharing-toggle"
import { cn } from "@/lib/utils"

interface AuthClusterProps {
  className?: string
  /** compact = indicateur point + toggle icône seulement (barre des cartes). */
  compact?: boolean
}

/**
 * Bloc authentification monté dans les en-têtes de page : connexion quand
 * déconnecté ; lien "Amis", indicateur + toggle de partage de position et
 * menu utilisateur quand connecté.
 */
export function AuthCluster({ className, compact = false }: AuthClusterProps) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isSignedIn ? (
        <>
          <Link
            href="/friends"
            className="rounded-sm px-2 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Amis
          </Link>
          <LocationSharingIndicator compact={compact} />
          <LocationSharingToggle compact={compact} />
          <CustomUserMenu />
        </>
      ) : (
        <CustomSignInButton />
      )}
    </div>
  )
}