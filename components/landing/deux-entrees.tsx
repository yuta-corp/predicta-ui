"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import {
  EASE,
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"

/**
 * Scène 06 — UNE VILLE. DEUX ENTRÉES.
 *
 * Deux expériences issues de la même carte — pas deux cartes : deux chemins.
 * La ville reste présente derrière ; la lime signale les deux portes.
 */
export function DeuxEntrees() {
  return (
    <section
      id="deux-entrees"
      aria-label="Une ville, deux entrées"
      className="relative border-t border-border/60"
    >
      {/* Voile : la carte reste lisible, le texte prend le dessus. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background/70"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Kicker>Deux façons d'entrer</Kicker>
        <LineReveal className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Une ville.
          <br />
          Deux entrées.
        </LineReveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-0">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:pr-14"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/50">
              Pour les gens
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Explorez Tana.
            </h3>
            <ul className="mt-5 space-y-2 text-[14.5px] leading-relaxed text-muted-foreground">
              <li>Lisez le trafic, à l'instant.</li>
              <li>Suivez les routes qui bougent.</li>
              <li>Cherchez un quartier, la carte s'y déplace.</li>
            </ul>
            <Link
              href="/map"
              className="group mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorer Tana
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="lg:border-l lg:border-border/60 lg:pl-14"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/50">
              Pour les développeurs
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Construisez avec le trafic.
            </h3>
            <ul className="mt-5 space-y-2 text-[14.5px] leading-relaxed text-muted-foreground">
              <li>Accédez à la même donnée que la carte.</li>
              <li>GeoJSON, clé par application, zéro persistance.</li>
              <li>Des applications qui comprennent Tana.</li>
            </ul>
            <Link
              href="/developers"
              className="group mt-8 inline-flex items-center gap-2 rounded-sm border border-border bg-background/50 px-5 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/50"
            >
              Construire avec l'API
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>
        </div>

        <FadeUp className="mt-16 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
          Deux regards sur la même ville. Le trafic qui traverse ces écrans est
          le même qui alimente l'API — la carte est le produit, la donnée est
          la matière.
        </FadeUp>
      </div>
    </section>
  )
}
