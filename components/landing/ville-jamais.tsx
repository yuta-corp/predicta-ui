"use client"

import { motion, useTransform } from "motion/react"

import {
  LineReveal,
  useSectionProgress,
} from "@/components/landing/motion-utils"

/**
 * Scène 02 — LA VILLE NE S'ARRÊTE JAMAIS.
 *
 * La carte ne disparaît pas : la caméra s'enfonce. La typographie est posée
 * directement sur le trafic qui coule — pas de diagramme, pas de carte dans
 * une carte. Le titre gonfle doucement puis cède la place.
 */
export function VilleJamais() {
  const { ref, scrollYProgress } = useSectionProgress()
  // Le titre cède la place tôt : la scène suivante entre pendant qu'il
  // s'estompe, jamais deux titres pleins en même temps dans le viewport.
  const scale = useTransform(scrollYProgress, [0, 0.45], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])

  return (
    <section
      id="ville-jamais"
      ref={ref}
      aria-label="La ville ne s'arrête jamais"
      className="relative flex min-h-[95vh] items-center overflow-hidden"
    >
      {/* Voiles : le trafic reste visible, le texte reste lisible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent"
      />

      <motion.div
        style={{ scale, opacity }}
        className="relative mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50">
          La ville, en mouvement
        </p>
        <LineReveal
          className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
          delay={0.05}
        >
          La ville ne s'arrête jamais.
        </LineReveal>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-7 max-w-md text-[15px] leading-relaxed text-foreground/75"
        >
          Des milliers de routes. Des milliers de mouvements. Une ville qui
          change à chaque instant.
        </motion.p>
      </motion.div>
    </section>
  )
}
