import { MotionConfig } from "motion/react"

import { LandingHeader } from "@/components/shell/landing-header"
import { LandingFooter } from "@/components/shell/landing-footer"
import { CityBackdrop } from "@/components/landing/city-backdrop"
import { Hero } from "@/components/landing/hero"
import { QuartierMarquee } from "@/components/landing/marquee"
import { VilleJamais } from "@/components/landing/ville-jamais"
import { VoirTana } from "@/components/landing/voir-tana"
import { ChaqueRoute } from "@/components/landing/chaque-route"
import { ConstruireDessus } from "@/components/landing/construire-dessus"
import { DeuxEntrees } from "@/components/landing/deux-entrees"
import { Recherche } from "@/components/landing/recherche"
import { BuildApi } from "@/components/landing/build-api"
import { Angle } from "@/components/landing/angle"
import { Pourquoi } from "@/components/landing/pourquoi"
import { Futur } from "@/components/landing/futur"
import { FinalLoop } from "@/components/landing/final-loop"

/**
 * PREDICTA — la carte vivante d'Antananarivo.
 *
 * Une seule expérience continue : la ville se réveille dans le héros, respire
 * sous la typographie, devient interface, se déconstruit en GeoJSON, devient
 * code, devient API — puis revient à la ville.
 *
 * LA CARTE EST LE PERSONNAGE PRINCIPAL. Une seule instance (CityBackdrop),
 * fixée derrière toute la page ; le scroll conduit la caméra (le réalisateur
 * dans city-backdrop), la lime signale, la typographie raconte.
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

        {/* La ville — une seule carte, vivante du premier au dernier pixel. */}
        <CityBackdrop />

        <main className="relative z-10">
          {/* Scène 01 — la ville se réveille. */}
          <Hero />

          {/* La ville est une liste de lieux — les vrais noms, qui défilent. */}
          <QuartierMarquee />

          {/* Scène 02 — la ville ne s'arrête jamais. */}
          <VilleJamais />

          {/* Scène 03 — voir Tana bouger. La carte devient interface. */}
          <VoirTana />

          {/* Scène 04 — chaque route est de la donnée. */}
          <ChaqueRoute />

          {/* Scène 05 — voir la donnée, construire dessus. */}
          <ConstruireDessus />

          {/* Scène 06 — une ville, deux entrées. */}
          <DeuxEntrees />

          {/* Scène 07 — votre ville, en temps réel. La recherche déplace la carte. */}
          <Recherche />

          {/* Scène 08 — construire avec Predicta. */}
          <BuildApi />

          {/* Scène 09 — une ville en mouvement, un autre angle. */}
          <Angle />

          {/* Scène 10 — pourquoi Predicta. */}
          <Pourquoi />

          {/* Scène 11 — la carte n'est que le début. */}
          <Futur />

          {/* Scène 12 — la boucle finale, retour à la ville entière. */}
          <FinalLoop />
        </main>

        <LandingFooter />
      </div>
    </MotionConfig>
  )
}
