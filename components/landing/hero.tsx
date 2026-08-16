"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useTransform } from "motion/react"

import { Wordmark } from "@/components/shell/wordmark"
import { EASE, useSectionProgress } from "@/components/landing/motion-utils"

/**
 * Scène 01 — LA VILLE SE RÉVEILLE.
 *
 * Aucune carte ici : le voile de fond (CityBackdrop) est déjà vivant derrière.
 * L'encre se dissout, la ville apparaît, la typographie entre en cascade —
 * puis, quand on scrolle, le titre quitte lentement l'écran pendant que la
 * caméra continue de s'enfoncer dans la ville.
 */
export function Hero() {
  const { ref, scrollYProgress } = useSectionProgress()
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const blockOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const blockY = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <section
      id="hero"
      ref={ref}
      aria-label="Antananarivo — la carte vivante"
      className="relative h-[calc(100dvh-3.5rem)] min-h-[560px] overflow-hidden sm:h-[calc(100dvh-4rem)]"
    >
      {/* Voile d'encre : la ville se réveille, l'écran se dissout. */}
      <div
        aria-hidden
        className="animate-veil-out pointer-events-none absolute inset-0 z-10 bg-background"
      />

      {/* Voile de lisibilité : la ville respire derrière le texte. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36rem] bg-gradient-to-t from-background via-background/45 to-transparent"
      />

      {/* Bloc héro — ancré en bas, il quitte l'écran avec le scroll. */}
      <motion.div
        style={{ opacity: blockOpacity, y: blockY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
      >
        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-28">
          <div className="max-w-3xl">
            {/* La marque d'abord — PREDICTA, puis la ville. */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.9, ease: EASE }}
            >
              <Wordmark size="lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.9, ease: EASE }}
            >
              <motion.h1
                className="mt-6 text-[clamp(3.2rem,11.5vw,7.75rem)] font-semibold leading-[0.9] tracking-[-0.035em] text-foreground"
                style={{ y: titleY }}
              >
                La ville
                <br />
                est <span className="text-lime-ink">vivante.</span>
              </motion.h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-foreground/80 sm:text-base">
                Antananarivo, en temps réel.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
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
              </div>
              <p className="mt-8 font-mono text-[11px] tracking-wide text-muted-foreground">
                Tuiles MVT z12–z16 · revalidation 45 s · géométries OpenStreetMap
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Indicateur de scroll */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center">
        <div className="animate-scroll-cue flex flex-col items-center gap-1 text-foreground/50">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em]">
            Défiler
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
