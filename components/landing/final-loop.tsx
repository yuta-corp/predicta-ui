"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import { Wordmark } from "@/components/shell/wordmark"
import { FadeUp, LineReveal } from "@/components/landing/motion-utils"

/**
 * Scène 12 — LA BOUCLE FINALE.
 *
 * La caméra recule, la ville entière réapparaît — toutes les routes bougent.
 * La même phrase qu'au matin, mais le visiteur sait maintenant ce qu'il voit.
 */
export function FinalLoop() {
  return (
    <section
      id="final"
      aria-label="La ville est vivante"
      className="relative flex min-h-[105vh] items-center justify-center overflow-hidden text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-background/85 to-transparent"
      />
      <div className="relative mx-auto w-full max-w-4xl px-5 py-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9 }}
          className="flex justify-center"
        >
          <Wordmark size="lg" />
        </motion.div>
        <LineReveal
          as="h2"
          className="mt-6 text-[clamp(2.8rem,8vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-foreground"
        >
          La ville est vivante.
        </LineReveal>
        <FadeUp className="mt-7 text-[15px] text-foreground/75" delay={0.2}>
          La carte vivante d'Antananarivo.
        </FadeUp>
        <FadeUp
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          delay={0.35}
        >
          <Link
            href="/map"
            className="group inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explorer Tana
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/developers"
            className="rounded-sm border border-border bg-background/50 px-5 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/50"
          >
            Construire avec l'API
          </Link>
        </FadeUp>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-14 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/55"
        >
          ville → carte → trafic → donnée → code → ville
        </motion.p>
      </div>
    </section>
  )
}
