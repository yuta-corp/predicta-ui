"use client"

import { motion } from "motion/react"

import { RoadFromData } from "@/components/landing/road-from-data"
import {
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"

const TRANSFORM = ["Route", "Géométrie", "GeoJSON"] as const

/**
 * Scène 04 — CHAQUE ROUTE EST DE LA DONNÉE.
 *
 * La route se sépare de la ville : elle devient géométrie, puis GeoJSON.
 * La feature ci-dessous est telle que l'API la renvoie réellement — survolez
 * ses propriétés, la route répond.
 */
export function ChaqueRoute() {
  return (
    <section
      id="chaque-route"
      aria-label="Chaque route est de la donnée"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Kicker>La donnée</Kicker>
        <LineReveal className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Chaque route est de la donnée.
        </LineReveal>
        <FadeUp className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          Une route observée est une ligne portant la vitesse mesurée et le
          ratio de congestion. La ville n'est pas illustrée — elle est décrite,
          coordonnée par coordonnée.
        </FadeUp>

        {/* Route → Géométrie → GeoJSON : la transformation, pas un diagramme. */}
        <div
          aria-hidden
          className="mt-12 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/60 sm:gap-4 sm:text-[12px]"
        >
          {TRANSFORM.map((step, i) => (
            <span key={step} className="flex items-center gap-3 sm:gap-4">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.28 }}
                className={i === 2 ? "text-lime-ink" : ""}
              >
                {step}
              </motion.span>
              {i < TRANSFORM.length - 1 && (
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.28 + 0.16 }}
                  className="text-foreground/35"
                >
                  →
                </motion.span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <RoadFromData />
        </div>
      </div>
    </section>
  )
}
