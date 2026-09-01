import type { Metadata } from "next"
import { MapShell } from "@/components/shell/map-shell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Carte du trafic — Antananarivo en temps réel",
  description:
    "Explorez la carte interactive du trafic d'Antananarivo. Visualisez les embouteillages, consultez l'état des routes et décidez avant de partir.",
  openGraph: {
    title: "Predicta — Carte du trafic d'Antananarivo",
    description:
      "Visualisez les embouteillages en temps réel et choisissez la meilleure route.",
  },
}

export default function CityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MapShell>{children}</MapShell>
}
