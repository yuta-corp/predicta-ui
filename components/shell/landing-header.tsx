"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Wordmark } from "@/components/shell/wordmark"
import { Nav, NAV_LINKS } from "@/components/shell/nav"
import { EASE } from "@/components/landing/motion-utils"
import { cn } from "@/lib/utils"

/**
 * Barre de navigation de la landing — STICKY : reste visible pendant tout le
 * scroll, du héros (par-dessus la carte) jusqu'au pied de page.
 * Un voile léger naît au passage du scroll pour rester lisible sur tout fond.
 * Sur mobile, la navigation bascule dans un menu burger.
 */
export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Ferme le menu dès qu'on navigue (ajustement pendant le rendu).
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape ferme le menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

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
        <div className="flex items-center gap-1">
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
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="rounded-sm p-2 text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile — les mêmes liens, pleine largeur, gros cibles. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="landing-menu"
            aria-label="Navigation mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-border/70 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-3 text-[15px] font-medium text-foreground transition-colors hover:text-lime-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-2 border-t border-border/60" />
              <div className="flex flex-col gap-2 pb-2">
                <Link
                  href="/map"
                  className="group inline-flex items-center justify-between rounded-sm bg-primary px-4 py-3 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Explorer Tana
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
