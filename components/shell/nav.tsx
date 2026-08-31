"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/** Navigation principale — partagée entre la carte et la landing. */
export const NAV_LINKS = [
  { href: "/map", label: "La carte" },
  { href: "/quartiers", label: "Quartiers" },
  { href: "/status", label: "Statut" },
] as const

interface NavProps {
  className?: string
}

/** Liens de navigation, couleurs sémantiques (fonctionne sur carte ET fonds solides). */
export function Nav({ className }: NavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Principale" className={cn("flex items-center gap-1", className)}>
      {NAV_LINKS.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-sm px-2.5 py-1.5 text-[13px] font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
