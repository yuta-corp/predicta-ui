"use client"

import {
  FadeUp,
  LineReveal,
} from "@/components/landing/motion-utils"

/**
 * Scène 09 — UNE VILLE EN MOUVEMENT.
 *
 * La caméra bascule en perspective : la ville devient un objet dans l'espace.
 * Un quadrillage technique vient se poser sur le relief — les couches de la
 * carte se superposent, le trafic continue de couler dessous.
 */
export function Angle() {
  return (
    <section
      id="angle"
      aria-label="Une ville en mouvement"
      className="relative flex min-h-[105vh] items-center overflow-hidden bg-background"
    >
      {/* Quadrillage technique — les couches de la carte, superposées sur le papier. */}
      <div aria-hidden className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
          Un autre angle
        </p>
        <LineReveal className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Une ville en mouvement.
        </LineReveal>
        <FadeUp className="mt-6 max-w-md text-[15px] leading-relaxed text-foreground/75">
          Predicta rend ce mouvement visible.
        </FadeUp>
      </div>
    </section>
  )
}
