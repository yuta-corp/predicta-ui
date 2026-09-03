"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"

import { Wordmark } from "@/components/shell/wordmark"
import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"
import { ScrollTriggerAnimatedSVG } from "@/components/landing/scroll-trigger-animated-svg"

initGsap()

const EnhancedCityMap = dynamic(
  () => import("@/components/map/enhanced-city-map").then((m) => m.EnhancedCityMap),
  { ssr: false }
)

/**
 * HERO — Le produit est visible, le mouvement guide l'œil.
 *
 * La carte MapLibre vit en arrière-plan. Le voile est léger.
 * L'entrée est chorégraphiée : chaque élément arrive avec un rythme.
 * Au scroll, le bloc quitte l'écran, la carte reste.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const block = blockRef.current
    if (!section || !block) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      // ─── Entrance choreography ───
      const tl = gsap.timeline({
        defaults: { ease: PREDICTA_EASE },
      })

      // Voile se dissout d'abord — la carte apparaît
      tl.fromTo(
        veilRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 1.4, delay: 0.2 }
      )
        // Wordmark entre
        .from(
          wordmarkRef.current,
          { opacity: 0, y: 30, duration: 0.8 },
          "-=0.8"
        )
        // Titre lettre par lettre (stagger sur les mots)
        .from(
          titleRef.current?.querySelectorAll("span") || [],
          {
            opacity: 0,
            y: 40,
            rotateX: -15,
            duration: 0.7,
            stagger: 0.06,
          },
          "-=0.4"
        )
        // Sous-titre
        .from(
          subtitleRef.current,
          { opacity: 0, y: 20, duration: 0.7 },
          "-=0.3"
        )
        // CTA
        .from(
          ctaRef.current,
          { opacity: 0, y: 16, scale: 0.95, duration: 0.6 },
          "-=0.3"
        )
        // Scroll hint
        .from(
          scrollHintRef.current,
          { opacity: 0, y: -10, duration: 0.5 },
          "-=0.1"
        )

      if (!reduced) {
        // ─── Scroll parallax — le bloc monte, la carte reste ───
        gsap.to(block, {
          y: -100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: 0.5,
          },
        })

        // La carte zoom légèrement au scroll
        gsap.to(section.querySelector("[data-map]")!, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        })

        // Le scroll hint disparaît vite
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "15% top",
            scrub: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Predicta — trafic en temps réel"
      className="relative h-[calc(100dvh-3.5rem)] min-h-[560px] overflow-hidden sm:h-[calc(100dvh-4rem)]"
    >
      {/* La carte — le produit, visible */}
      <div data-map className="absolute inset-0 z-0 origin-center">
        <EnhancedCityMap
          forceLight
          drift
          interactive={false}
          showControls={false}
          className="h-full w-full"
        />
      </div>

      {/* SVG Contours animés au scroll */}
      <ScrollTriggerAnimatedSVG triggerRef={sectionRef} className="text-lime-ink/10" />

      {/* Voile — se dissout à l'entrée */}
      <div
        ref={veilRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-background"
      />

      {/* Gradient de lisibilité — la carte reste visible en haut, le texte se lit partout */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 backdrop-blur-[2px] sm:backdrop-blur-[1px]"
      />
      {/* Sous-couche plus opaque en bas pour le texte — mobile especially */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent sm:h-40"
      />

      {/* Bloc texte */}
      <div
        ref={blockRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
      >
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="max-w-3xl">
            <div ref={wordmarkRef}>
              <Wordmark size="lg" />
            </div>

            <h1
              ref={titleRef}
              className="mt-6 text-[clamp(2.8rem,10vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-foreground"
            >
              <span className="inline-block">Le</span>{" "}
              <span className="inline-block">trafic</span>{" "}
              <span className="inline-block">de</span>{" "}
              <span className="inline-block">Tana</span>
              <br />
              <span className="inline-block">en</span>{" "}
              <span className="inline-block text-lime-ink">temps</span>{" "}
              <span className="inline-block text-lime-ink">réel.</span>
            </h1>

            <p
              ref={subtitleRef}
              className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/75 sm:text-base"
            >
              Voyez les embouteillages avant de partir.
              <br />
              Choisissez votre route en connaissance de cause.
            </p>

            <div
              ref={ctaRef}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/map"
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20"
              >
                Voir la carte
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center"
      >
        <div className="flex flex-col items-center gap-1 text-foreground/40">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em]">
            Défiler
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
