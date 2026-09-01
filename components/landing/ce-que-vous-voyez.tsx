"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Kicker, LineReveal } from "@/components/landing/motion-utils"
import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"

initGsap()

/**
 * SECTION — Ce que vous voyez.
 *
 * Montre concrètement ce que la carte affiche.
 * GSAP choreography : cards entrent avec stagger + scale,
 * les SVG roads se dessinent au scroll.
 *
 * Palette cohérente avec le fond Predicta — pas de dark cards.
 */
export function CeQueVousVoyez() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const cards = cardsRef.current
    if (!section || !title || !cards) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) return

      // ─── Titre : scale up dramatique au scroll ───
      gsap.fromTo(
        title,
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: PREDICTA_EASE,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        }
      )

      // ─── Cards : stagger avec scale + rotation ───
      const cardEls = cards.querySelectorAll("[data-card]")
      gsap.fromTo(
        cardEls,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotateY: -8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: PREDICTA_EASE,
          scrollTrigger: {
            trigger: cards,
            start: "top 80%",
            once: true,
          },
        }
      )

      // ─── Chaque SVG road se dessine au scroll ───
      cards.querySelectorAll(".feature-road").forEach((road) => {
        const length = (road as SVGPathElement).getTotalLength?.() || 300
        gsap.fromTo(
          road,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: road,
              start: "top 85%",
              once: true,
            },
          }
        )
      })

      // ─── Parallax subtle sur les illustrations ───
      cards.querySelectorAll("[data-card]").forEach((card, i) => {
        gsap.to(card, {
          y: -10 * (i % 2 === 0 ? 1 : -1),
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ce-que-vous-voyez"
      aria-label="Ce que vous voyez"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div ref={titleRef} className="mx-auto max-w-3xl">
          <Kicker>La carte</Kicker>
          <LineReveal className="mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
            Tout ce que vous voyez
            <br />
            est en temps réel.
          </LineReveal>
        </div>

        {/* 3 features — stagger + scale + rotation */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8"
          style={{ perspective: "1200px" }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              data-card
              className="group overflow-hidden rounded-md border border-border/70 bg-[#F1F1ED] transition-shadow hover:shadow-xl hover:shadow-black/5"
            >
              {/* Illustration SVG — fond clair, cohérent avec le papier Predicta */}
              <div className="overflow-hidden">{feature.illustration}</div>
              <div className="p-5">
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    title: "Les routes",
    description:
      "Chaque route d'Antananarivo apparaît sur la carte avec son état de trafic actuel.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="Routes avec trafic">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="fg1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#fg1)" />
        {/* Routes secondaires */}
        <path d="M 40 100 C 80 90, 120 80, 160 75" fill="none" stroke="rgba(7,7,7,0.08)" strokeWidth={2} strokeLinecap="round" />
        <path d="M 240 60 C 280 70, 320 80, 360 90" fill="none" stroke="rgba(7,7,7,0.08)" strokeWidth={2} strokeLinecap="round" />
        {/* Route principale — casing */}
        <path d="M 30 120 C 100 100, 180 60, 260 50 S 340 45, 390 60" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={7} strokeLinecap="round" />
        {/* Route fluide */}
        <path d="M 30 120 C 100 100, 180 60, 260 50" fill="none" stroke="#7fae3f" strokeWidth={4} strokeLinecap="round" className="feature-road" />
        {/* Route congestionnée */}
        <path d="M 260 50 S 340 45, 390 60" fill="none" stroke="#d95f45" strokeWidth={4} strokeLinecap="round" className="feature-road" />
        {/* Points */}
        <circle cx={140} cy={72} r={3} fill="#7fae3f" opacity={0.7} />
        <circle cx={320} cy={48} r={3} fill="#d95f45" opacity={0.7} />
      </svg>
    ),
  },
  {
    title: "L'état du trafic",
    description:
      "Vert = fluide. Rouge = embouteillé. Vous voyez tout de suite ce qui vous attend.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="État du trafic">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="fg2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#fg2)" />
        {/* Légende */}
        <rect x={30} y={30} width={60} height={5} rx={2.5} fill="#7fae3f" />
        <text x={100} y={36} fill="#6b7a5e" fontSize={9} fontFamily="var(--font-sans)">fluide</text>
        <rect x={30} y={48} width={60} height={5} rx={2.5} fill="#df9f3a" />
        <text x={100} y={54} fill="#6b7a5e" fontSize={9} fontFamily="var(--font-sans)">ralenti</text>
        <rect x={30} y={66} width={60} height={5} rx={2.5} fill="#d95f45" />
        <text x={100} y={72} fill="#6b7a5e" fontSize={9} fontFamily="var(--font-sans)">congestionné</text>
        {/* Statut route */}
        <rect x={220} y={24} width={150} height={48} rx={4} fill="rgba(127,174,63,0.1)" stroke="rgba(127,174,63,0.25)" strokeWidth={1} />
        <text x={295} y={44} textAnchor="middle" fill="#5a7a2e" fontSize={20} fontFamily="var(--font-sans)" fontWeight="600">0.9</text>
        <text x={295} y={60} textAnchor="middle" fill="#6b7a5e" fontSize={7} fontFamily="var(--font-sans)">INDÉPENDANCE · FLUIDE</text>
        <rect x={220} y={82} width={150} height={48} rx={4} fill="rgba(217,95,69,0.1)" stroke="rgba(217,95,69,0.25)" strokeWidth={1} />
        <text x={295} y={102} textAnchor="middle" fill="#c44a2e" fontSize={20} fontFamily="var(--font-sans)" fontWeight="600">0.3</text>
        <text x={295} y={118} textAnchor="middle" fill="#6b7a5e" fontSize={7} fontFamily="var(--font-sans)">ANTOHERENANA · BLOQUÉ</text>
      </svg>
    ),
  },
  {
    title: "Les informations",
    description:
      "Cliquez sur une route pour voir son nom, sa vitesse et son état actuel.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="Informations d'une route">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="fg3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#fg3)" />
        {/* Route */}
        <path d="M 30 140 C 100 120, 160 80, 220 60 S 320 30, 380 20" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={7} strokeLinecap="round" />
        <path d="M 30 140 C 100 120, 160 80, 220 60 S 320 30, 380 20" fill="none" stroke="#7fae3f" strokeWidth={4} strokeLinecap="round" className="feature-road" />
        {/* Panneau d'info */}
        <rect x={180} y={80} width={190} height={72} rx={5} fill="#F7F7F4" stroke="rgba(7,7,7,0.12)" strokeWidth={1} />
        <text x={194} y={100} fill="#5a7a2e" fontSize={9} fontFamily="var(--font-sans)" fontWeight="600">AVENUE DE L'INDÉPENDANCE</text>
        <text x={194} y={116} fill="#6b7a5e" fontSize={8} fontFamily="var(--font-sans)">Vitesse : 32 km/h</text>
        <text x={194} y={130} fill="#6b7a5e" fontSize={8} fontFamily="var(--font-sans)">État : fluide</text>
        <text x={194} y={144} fill="#6b7a5e" fontSize={8} fontFamily="var(--font-sans)">Mis à jour il y a 45 s</text>
      </svg>
    ),
  },
] as const
