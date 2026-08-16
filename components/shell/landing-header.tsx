"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Wordmark } from "@/components/shell/wordmark"
import { Nav } from "@/components/shell/nav"
import { cn } from "@/lib/utils"

/**
 * Barre de navigation de la landing — STICKY : reste visible pendant tout le
 * scroll, du héros (par-dessus la carte) jusqu'au pied de page.
 * Un voile léger naît au passage du scroll pour rester lisible sur tout fond.
 */
export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border/70 bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-[3px]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:h-16 sm:px-8">
        <Wordmark />
        <div className="hidden md:block">
          <Nav />
        </div>
        <Link
          href="/map"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-lime-ink"
        >
          Explorer Tana
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </header>
  )
}
