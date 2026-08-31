import { LandingHeader } from "@/components/shell/landing-header"
import { LandingFooter } from "@/components/shell/landing-footer"
import { Hero } from "@/components/landing/hero"
import { CeQueVousVoyez } from "@/components/landing/ce-que-vous-voyez"
import { FinalLoop } from "@/components/landing/final-loop"

/**
 * PREDICTA — Le trafic d'Antananarivo en temps réel.
 *
 * Landing simple et directe. Le visiteur comprend en une seconde :
 * Predicta montre les embouteillages pour décider avant de partir.
 */
export default function LandingPage() {
  return (
    <div className="light bg-background text-foreground">
      <LandingHeader />

      <main className="relative">
        <Hero />
        <CeQueVousVoyez />
        <FinalLoop />
      </main>

      <LandingFooter />
    </div>
  )
}
