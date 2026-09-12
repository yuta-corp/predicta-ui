/**
 * Ouvre la visite guidée depuis n'importe quel bouton de l'interface.
 */

export const TOUR_OPEN_EVENT = "predicta:tour-open"

/** Déclenche l'ouverture de la visite guidée. */
export function openTour(): void {
  window.dispatchEvent(new CustomEvent(TOUR_OPEN_EVENT))
}