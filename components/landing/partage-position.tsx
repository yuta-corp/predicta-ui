"use client"

import { FadeUp, Kicker, LineReveal } from "@/components/landing/motion-utils"

/**
 * SECTION — Partager sa position, vos proches, la vérité des embouteillages.
 *
 * Le ton vient du post de lancement de la feature : savoir où se trouvent
 * l'enfant, le conjoint ou l'ami ; vérifier l'excuse « be embouteillage » ;
 * et fonctionner où qu'on soit, même hors d'Antananarivo.
 */
export function PartagePosition() {
  return (
    <section
      id="partage-position"
      aria-label="Partager sa position avec vos proches"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Kicker>Vos proches</Kicker>
          <LineReveal className="mt-5 max-w-2xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
            Savoir où ils sont.
            <br />
            Et si c'est vrai.
          </LineReveal>
          <FadeUp className="mt-6 max-w-xl text-[15px] leading-relaxed text-foreground/75">
            Partagez votre position avec vos amis et votre famille — et voyez la
            leur quand ils la partagent avec vous. En temps réel, où qu'ils
            soient.
          </FadeUp>
        </div>

        {/* 3 usages — stagger doux */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {FEATURE_CARDS.map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.1}>
              <div className="h-full overflow-hidden rounded-md border border-border/70 bg-[#F1F1ED] transition-shadow hover:shadow-xl hover:shadow-black/5">
                <div className="overflow-hidden">{card.illustration}</div>
                <div className="p-5">
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.15}>
          <p className="mx-auto mt-12 max-w-lg text-center text-[13px] leading-relaxed text-muted-foreground">
            Vous choisissez toujours qui peut vous voir — et vous pouvez arrêter
            le partage à tout moment.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

const FEATURE_CARDS = [
  {
    title: "Vos proches",
    description:
      "Votre enfant, votre conjoint ou votre ami : sachez où ils se trouvent en un coup d'œil sur la carte.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="Un proche suivis sur la carte">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="cp1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#cp1)" />
        {/* Routes */}
        <path d="M 30 40 C 90 60, 150 70, 210 80 S 340 70, 380 40" fill="none" stroke="rgba(7,7,7,0.1)" strokeWidth={3} strokeLinecap="round" />
        <path d="M 60 150 C 120 120, 200 100, 300 90" fill="none" stroke="rgba(7,7,7,0.1)" strokeWidth={3} strokeLinecap="round" />
        {/* Marqueur proche (adulte) */}
        <circle cx={110} cy={86} r={14} fill="rgba(37,99,235,0.12)" />
        <circle cx={110} cy={86} r={6} fill="#2563eb" stroke="#fff" strokeWidth={2} />
        {/* Marqueur enfant, plus petit */}
        <circle cx={270} cy={60} r={11} fill="rgba(127,174,63,0.12)" />
        <circle cx={270} cy={60} r={4.5} fill="#7fae3f" stroke="#fff" strokeWidth={2} />
        {/* Halo pulse */}
        <circle cx={270} cy={60} r={16} fill="rgba(127,174,63,0.18)">
          <animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
  },
  {
    title: "« Be embouteillage » ?",
    description:
      "« Tena tavela eto aho fa be embouteillage be. » Vérifiez sur la carte si l'excuse est vraie.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="Vérifier si l'excuse de trafic est vraie">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="cp2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#cp2)" />
        {/* Route congestionnée, puis fluide */}
        <path d="M 24 120 C 90 100, 150 70, 240 48 S 370 40, 388 52" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={8} strokeLinecap="round" />
        <path d="M 24 120 C 90 100, 150 70, 240 48" fill="none" stroke="#d95f45" strokeWidth={5} strokeLinecap="round" />
        <path d="M 240 48 S 370 40, 388 52" fill="none" stroke="#7fae3f" strokeWidth={5} strokeLinecap="round" />
        {/* Le message qui se vérifie */}
        <text x={200} y={26} textAnchor="middle" fill="#6b7a5e" fontSize={10} fontFamily="var(--font-sans)" fontStyle="italic">
          « Be embouteillage be. »
        </text>
        {/* Marqueur bloqué + coche */}
        <circle cx={120} cy={86} r={6} fill="#d95f45" stroke="#fff" strokeWidth={2} />
        <circle cx={330} cy={46} r={6} fill="#7fae3f" stroke="#fff" strokeWidth={2} />
        {/* Coche verte */}
        <path d="M 315 46 l 5 5 l 11 -11" fill="none" stroke="#5a7a2e" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Où qu'ils soient",
    description:
      "Pas besoin d'être à Antananarivo : le partage fonctionne partout dans le monde.",
    illustration: (
      <svg viewBox="0 0 400 180" className="block w-full" role="img" aria-label="Partage de position à l'échelle mondiale">
        <rect width="400" height="180" fill="#F1F1ED" />
        <defs>
          <pattern id="cp3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(7,7,7,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="180" fill="url(#cp3)" />
        {/* Globe stylisé */}
        <circle cx={200} cy={96} r={66} fill="rgba(37,99,235,0.05)" stroke="rgba(37,99,235,0.2)" strokeWidth={1.5} />
        <ellipse cx={200} cy={96} rx={66} ry={24} fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth={1} />
        <path d="M 134 96 q 33 -20 66 0 q 33 20 66 0" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth={1} />
        {/* Arc entre les deux positions */}
        <path d="M 150 70 Q 200 40 250 96" fill="none" stroke="rgba(127,174,63,0.5)" strokeWidth={1.5} strokeDasharray="4 4" />
        {/* Positions éloignées */}
        <circle cx={150} cy={70} r={6} fill="#2563eb" stroke="#fff" strokeWidth={2} />
        <circle cx={250} cy={96} r={6} fill="#7fae3f" stroke="#fff" strokeWidth={2} />
        {/* Étiquettes */}
        <text x={150} y={58} textAnchor="middle" fill="#6b7a5e" fontSize={9} fontFamily="var(--font-sans)">Antananarivo</text>
        <text x={250} y={118} textAnchor="middle" fill="#6b7a5e" fontSize={9} fontFamily="var(--font-sans)">Paris</text>
      </svg>
    ),
  },
] as const