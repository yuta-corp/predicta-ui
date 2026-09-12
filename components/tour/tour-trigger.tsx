"use client"

import { openTour } from "@/components/tour/tour-open"

/** Bouton de relance de la visite guidée, dans la barre des cartes. */
export function TourTrigger() {
  return (
    <button
      type="button"
      onClick={openTour}
      className="rounded-sm px-2 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Revoir la visite guidée"
    >
      Découvrir
    </button>
  )
}