"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="fr">
      <body className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div className="max-w-md px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
            Predicta
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Quelque chose s'est mal passé.
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            La ville n'a pas pu être affichée. Réessayez, ou revenez à
            l'accueil.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-sm bg-primary px-4 py-2.5 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Réessayer
            </button>
            <Link
              href="/"
              className="rounded-sm border border-border px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:border-foreground/40"
            >
              Accueil
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
