"use client"

import { RoutePanel } from "@/components/map/route-panel"
import { LineReveal } from "@/components/landing/motion-utils"

/**
 * Scène 03 — VOIR TANA BOUGER.
 *
 * La fenêtre du produit : la carte de fond redevient une interface (la souris
 * lui est rendue par CityBackdrop quand cette section est à l'écran). Survolez
 * une route — elle se détache. Cliquez — le panneau s'installe, la caméra
 * glisse vers elle, les chiffres s'animent.
 */
export function VoirTana() {
  return (
    <section
      id="voir-tana"
      aria-label="Voir Tana bouger — la carte en direct"
      // Section 200vh : la fenêtre sticky (100dvh) reste épinglée pendant
      // presque un viewport de scroll — le temps d'interagir avec la carte.
      className="pointer-events-none relative h-[200dvh]"
    >
      <div className="pointer-events-none sticky top-14 flex h-[calc(100dvh-3.5rem)] flex-col sm:top-16 sm:h-[calc(100dvh-4rem)]">
        {/* En-tête de fenêtre : le produit, sans cadre. */}
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
                La carte, en direct
              </p>
              <LineReveal
                as="h2"
                className="mt-3 text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
              >
                Voir Tana bouger.
              </LineReveal>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-foreground/70">
                Ce qui se passe sur les routes, à l'instant.
              </p>
            </div>
            <p className="hidden pb-1 font-mono text-[11px] tracking-wide text-foreground/50 md:block">
              survolez · cliquez · la ville répond
            </p>
          </div>
        </div>

        {/* Panneau de la route sélectionnée — la donnée devient lisible. */}
        <div className="pointer-events-auto absolute bottom-20 right-4 z-20 sm:bottom-auto sm:right-6 sm:top-28">
          <RoutePanel />
        </div>

        {/* Légende basse — la carte est une interface. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-5">
          <p className="font-mono text-[11px] tracking-wide text-foreground/60">
            Cliquez une route — elle se détache du réseau. La caméra la rejoint.
          </p>
        </div>
      </div>
    </section>
  )
}
