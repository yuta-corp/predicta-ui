"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"

initGsap()

/**
 * FINAL CTA — Dramatique, pas une répétition du hero.
 *
 * Le titre apparaît avec un scale dramatique.
 * Le CTA pulse subtilement.
 */
export function FinalLoop() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) return

      // Titre : scale up dramatique + fade
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: PREDICTA_EASE,
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        }
      )

      // CTA : arrive avec un slight bounce
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          delay: 0.3,
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="final"
      aria-label="Voir la carte"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden border-t border-border/60 bg-background text-center"
    >
      <div className="relative mx-auto w-full max-w-4xl px-5 py-28 sm:px-8">
        <h2
          ref={titleRef}
          className="text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
        >
          Voyez les embouteillages
          <br />
          avant de partir.
        </h2>

        <div ref={ctaRef} className="mt-10">
          <Link
            href="/map"
            className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20"
          >
            Voir la carte
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
