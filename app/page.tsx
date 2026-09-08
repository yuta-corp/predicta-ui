import { LandingHeader } from "@/components/shell/landing-header"
import { LandingFooter } from "@/components/shell/landing-footer"
import { Hero } from "@/components/landing/hero"
import { CeQueVousVoyez } from "@/components/landing/ce-que-vous-voyez"
import { FinalLoop } from "@/components/landing/final-loop"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://predicta-ui.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Predicta",
  url: SITE_URL,
  description:
    "Voyez les embouteillages d'Antananarivo en temps réel avant de partir.",
  inLanguage: "fr",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/map?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Predicta",
  url: SITE_URL,
  applicationCategory: "NavigationApplication",
  operatingSystem: "Web",
  description:
    "Application de trafic en temps réel pour Antananarivo. Visualisez les embouteillages et décidez avant de partir.",
  inLanguage: "fr",
}

/**
 * PREDICTA — Le trafic d'Antananarivo en temps réel.
 *
 * Landing simple et directe. Le visiteur comprend en une seconde :
 * Predicta montre les embouteillages pour décider avant de partir.
 */
export default function LandingPage() {
  return (
    <div className="light bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />

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
