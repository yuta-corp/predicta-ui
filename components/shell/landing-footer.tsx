import Link from "next/link"
import { Wordmark } from "@/components/shell/wordmark"

const NAV_LINKS = [
  { href: "/map", label: "La carte" },
  { href: "/quartiers", label: "Quartiers" },
  { href: "/status", label: "Statut" },
] as const

const LEGAL_LINKS = [
  { href: "/legal", label: "Mentions légales" },
  { href: "/terms", label: "Conditions d'utilisation" },
  { href: "/terms-of-sale", label: "Conditions de vente" },
  { href: "/privacy", label: "Confidentialité" },
  { href: "/privacy-center", label: "Privacy Center" },
  { href: "/cookies", label: "Cookies" },
] as const

/** Pied de page de la landing — navigation, pages légales, attribution. */
export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            Le trafic d'Antananarivo en temps réel. Décidez avant de
            partir.
          </p>
        </div>
        <nav aria-label="Navigation" className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Explorer
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Légal" className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Légal
          </p>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-[11px] text-muted-foreground/85 sm:px-8">
          <span>© 2026 Predicta. Tous droits réservés.</span>
          <span>Fond © OpenStreetMap · OpenFreeMap · Données API Predicta</span>
        </div>
      </div>
    </footer>
  )
}
