"use client"

import { motion } from "motion/react"

import {
  EASE,
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"

const STATEMENTS = [
  {
    title: "Voir ce qui bouge.",
    caption:
      "Les flux apparaissent, route par route — la ville se lit comme elle vit.",
  },
  {
    title: "Comprendre ce qui se passe.",
    caption:
      "Nom, vitesse observée, ratio de congestion : l'état réel, pas une estimation.",
  },
  {
    title: "Construire dessus.",
    caption:
      "La même donnée, en GeoJSON, pour vos applications — la carte devient la vôtre.",
  },
] as const

/**
 * Scène 10 — POURQUOI PREDICTA.
 *
 * Trois affirmations, chacune ouvrant une ligne de signal : le rythme est la
 * structure. La ville continue de bouger derrière.
 */
export function Pourquoi() {
  return (
    <section
      id="pourquoi"
      aria-label="Pourquoi Predicta"
      className="relative border-t border-border/60"
    >
      {/* Voile : la perspective reste présente, le texte prend le dessus. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background/65"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Kicker>Pourquoi Predicta</Kicker>
        <LineReveal className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Du mouvement à la compréhension.
        </LineReveal>

        <div className="mt-16 space-y-14">
          {STATEMENTS.map((s) => (
            <div key={s.title} className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
              <div>
                {/* Ligne de signal — elle se trace quand la phrase apparaît. */}
                <div className="mb-5 h-px w-24 overflow-hidden">
                  <motion.div
                    className="h-px w-full bg-primary"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
                <LineReveal
                  as="h3"
                  className="text-[clamp(1.7rem,3.8vw,2.9rem)] font-semibold leading-tight tracking-[-0.02em] text-foreground"
                  delay={0.1}
                >
                  {s.title}
                </LineReveal>
              </div>
              <FadeUp className="flex items-end lg:pb-1.5" delay={0.25}>
                <p className="max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                  {s.caption}
                </p>
              </FadeUp>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
