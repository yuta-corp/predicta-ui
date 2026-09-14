"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

import { Kicker, LineReveal, FadeUp } from "@/components/landing/motion-utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"

initGsap()

function animateSection(section: HTMLElement, title: HTMLElement): void {
  gsap.fromTo(
    title,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: PREDICTA_EASE,
      scrollTrigger: { trigger: section, start: "top 70%", once: true },
    }
  )
}

export function Milestone() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    if (!section || !title) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (reduced) return
      animateSection(section, title)
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="milestone"
      aria-label="Milestone"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <div ref={titleRef}>
          <Kicker>Milestone</Kicker>
          <LineReveal
            className="mx-auto mt-5 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground"
            as="h2"
          >
            100 personnes ont rejoint Predicta.
          </LineReveal>
        </div>

        <FadeUp className="mx-auto mt-10 max-w-xl space-y-5 text-[15px] leading-relaxed text-muted-foreground" delay={0.2}>
          <p>
            Il y a quelques jours, nous avons ouvert Predicta en version bêta.
            Une question simple : est-ce que vous allez réellement l&apos;utiliser ?
          </p>
          <p>
            Aujourd&apos;hui, 100 personnes ont créé leur compte. Merci à chacune
            d&apos;entre vous pour vos retours, votre confiance et votre patience.
          </p>
          <p>
            Cette première étape confirme une chose : Predicta mérite d&apos;aller
            plus loin.
          </p>
        </FadeUp>

        <InfoCard />
        <MilestoneAvatars />
      </div>
    </section>
  )
}

const INFO_ITEMS = [
  "La phase bêta touche à sa fin.",
  "La mise en production officielle est prévue prochainement.",
  "Seuls les bêta-testeurs pourront continuer à utiliser l'application d'ici là.",
  "Un cadeau vous attend pour le lancement officiel.",
]

function InfoCard() {
  return (
    <FadeUp className="mx-auto mt-12 max-w-xl text-left" delay={0.35}>
      <div className="rounded-md border border-border/70 bg-[#F1F1ED] p-6">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-foreground/60">
          À savoir
        </h3>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-foreground/80">
          {INFO_ITEMS.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}

const MEMBERS = [
  { seed: "mina", initials: "MI" },
  { seed: "tiana", initials: "TI" },
  { seed: "sahondra", initials: "SA" },
  { seed: "harena", initials: "HA" },
  { seed: "mialy", initials: "MY" },
  { seed: "rojo", initials: "RO" },
  { seed: "sitraka", initials: "SI" },
  { seed: "faly", initials: "FA" },
  { seed: "noro", initials: "NO" },
  { seed: "vola", initials: "VO" },
  { seed: "aina", initials: "AI" },
  { seed: "safidy", initials: "SF" },
] as const

function MilestoneAvatars() {
  return (
    <FadeUp className="mt-14 flex flex-col items-center gap-4" delay={0.45}>
      <AvatarGroup className="grayscale">
        {MEMBERS.map((member) => (
          <Avatar key={member.seed}>
            <AvatarImage
              src={`https://i.pravatar.cc/80?u=${member.seed}`}
              alt={member.seed}
            />
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+88</AvatarGroupCount>
      </AvatarGroup>
      <p className="text-[13px] text-muted-foreground">
        100 utilisateurs nous ont déjà rejoints.
      </p>
    </FadeUp>
  )
}
