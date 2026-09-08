import Link from "next/link"
import type { ReactNode } from "react"
import { SiteHeader } from "@/components/shell/site-header"

const LEGAL_LINKS = [
  ["/privacy", "Confidentialité"],
  ["/terms", "Conditions"],
  ["/cookies", "Cookies"],
  ["/privacy-center", "Centre de confidentialité"],
] as const

interface DocumentLayoutProps {
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}

/** Mise en page des pages documentaires — typographie, zéro card. */
export function DocumentLayout({
  eyebrow,
  title,
  intro,
  children,
}: DocumentLayoutProps) {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-foreground/75">
            {intro}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </div>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-6 text-[12px] text-muted-foreground">
          {LEGAL_LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="transition-colors hover:text-foreground">
              {label}
            </Link>
          ))}
          <span className="ml-auto">© 2026 Predicta</span>
        </div>
      </footer>
    </main>
  )
}
