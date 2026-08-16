import { MotionConfig } from "motion/react"

import { LandingHeader } from "@/components/shell/landing-header"
import { LandingFooter } from "@/components/shell/landing-footer"
import { Hero } from "@/components/landing/hero"
import { DeuxEntrees } from "@/components/landing/deux-entrees"
import { ConstruireDessus } from "@/components/landing/construire-dessus"
import { Recherche } from "@/components/landing/recherche"
import { BuildApi } from "@/components/landing/build-api"
import { Angle } from "@/components/landing/angle"
import { Pourquoi } from "@/components/landing/pourquoi"
import { Futur } from "@/components/landing/futur"
import { FinalLoop } from "@/components/landing/final-loop"

/**
 * PREDICTA — la carte vivante d'Antananarivo.
 *
 * La carte est le héros : elle se réveille dans la première section, puis le
 * récit devient produit, donnée, code — sur papier. La carte ne vit que dans
 * le héros ; les sections suivantes racontent, la recherche ouvre la carte
 * réelle (/map) sur le quartier choisi.
 *
 * La landing se présente toujours en mode blanc (papier chaud + encre) —
 * c'est la direction artistique de l'expérience. Les pages produit, elles,
 * suivent le thème de l'utilisateur.
 */
export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="light bg-background text-foreground">
        <LandingHeader />

        <main className="relative">
          {/* La ville se réveille — la carte vit dans le héros. */}
          <Hero />

          {/* Une ville, deux entrées. */}
          <DeuxEntrees />

          {/* Voir la donnée, construire dessus. */}
          <ConstruireDessus />

          {/* Votre ville, en temps réel — la recherche ouvre la carte. */}
          <Recherche />

          {/* Construire avec Predicta. */}
          <BuildApi />

          {/* Une ville en mouvement, un autre angle. */}
          <Angle />

          {/* Pourquoi Predicta. */}
          <Pourquoi />

          {/* La carte n'est que le début. */}
          <Futur />

          {/* La boucle finale, retour à la ville. */}
          <FinalLoop />
        </main>

        <LandingFooter />
      </div>
    </MotionConfig>
  )
}
