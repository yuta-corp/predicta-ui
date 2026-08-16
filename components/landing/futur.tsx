"use client"

import { motion } from "motion/react"

import {
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"

/**
 * Scène 11 — LA CARTE N'EST QUE LE DÉBUT.
 *
 * La vision, sans rien promettre : la carte s'élargit, des couches se
 * superposent. Aucune fonctionnalité inventée — seulement l'infrastructure.
 */
export function Futur() {
  return (
    <section
      id="futur"
      aria-label="La carte n'est que le début"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
        <div>
          <Kicker>La suite</Kicker>
          <LineReveal className="mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
            La carte n'est que le début.
          </LineReveal>
          <FadeUp className="mt-7 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Predicta construit l'infrastructure d'une ville plus facile à
            comprendre, à connecter et à construire. Chaque route observée est
            une brique de plus — aujourd'hui, le trafic. Demain, ce que cette
            matière rend possible.
          </FadeUp>
          <FadeUp className="mt-6 max-w-lg font-mono text-[11.5px] tracking-wide text-foreground/55" delay={0.15}>
            Pas de promesse — des couches qui s'ajoutent, une ville qui se
            laisse lire.
          </FadeUp>
        </div>

        {/* Les couches s'ajoutent — géométrie, pas gadget. */}
        <div aria-hidden className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, delay: i * 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute border border-foreground/12"
              style={{
                width: `${9 + i * 4.5}rem`,
                height: `${6 + i * 3}rem`,
                rotate: `${i * 4 - 4}deg`,
              }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary"
          />
        </div>
      </div>
    </section>
  )
}
