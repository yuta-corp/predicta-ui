"use client"

import dynamic from "next/dynamic"
import Link from "next/link"

import { Wordmark } from "@/components/shell/wordmark"
import { Nav } from "@/components/shell/nav"
import { Search } from "@/components/map/search"
import { Freshness } from "@/components/map/freshness"
import { RoutePanel } from "@/components/map/route-panel"
import { MapControls } from "@/components/map/map-controls"
import { GeolocationControl } from "@/components/map/geolocation-control"
import { MapLegend } from "@/components/map/map-legend"
import { useMap } from "@/components/map/city-map"
import { formatCoordinates } from "@/lib/format"

const CityMap = dynamic(
  () => import("@/components/map/city-map").then((m) => m.CityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <p className="animate-pulse text-[12px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
          Predicta
        </p>
      </div>
    ),
  }
)

function ViewReadout() {
  const { view } = useMap()
  if (!view) return null
  return (
    <p className="hidden font-mono text-[10.5px] tabular-nums tracking-wide text-muted-foreground/70 lg:block">
      {formatCoordinates(view.lon, view.lat)} · z {view.zoom.toFixed(1)}
    </p>
  )
}

/**
 * Coquille cartographique : la carte EST le produit, tout le reste est
 * du chrome minimal posé par-dessus. La carte persiste entre les routes.
 */
export function MapShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <CityMap />
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Barre haute : wordmark, navigation, recherche, statut.
            Voile translucide + flou : la barre reste lisible sur la carte,
            quels que soient le fond et le thème. */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-border/50 bg-background/70 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <div className="pointer-events-auto flex items-center gap-5">
            <Wordmark />
            <div className="hidden md:block">
              <Nav />
            </div>
          </div>
          <div className="pointer-events-auto flex items-center gap-3">
            <Search />
            <Link
              href="/status"
              className="hidden rounded-sm px-2 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Statut
            </Link>
          </div>
        </header>

        {/* Légende trafic : palette colorée + signification, en haut à gauche. */}
        <div className="absolute left-4 top-20 z-20 sm:left-6">
          <MapLegend />
        </div>

        {/* Panneau route sélectionnée (desktop : à droite, mobile : en bas) */}
        <div className="absolute bottom-24 right-4 z-20 sm:bottom-auto sm:right-6 sm:top-20 sm:bottom-auto">
          <RoutePanel />
        </div>

        {/* Barre basse : fraîcheur, coordonnées, attribution, contrôles */}
        <footer className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-3 sm:px-6 sm:pb-4">
          <div className="flex flex-col gap-1.5">
            <Freshness />
            <p className="hidden text-[10px] text-muted-foreground/50 sm:block">
              Fond © OpenStreetMap · OpenFreeMap · Données API Predicta ·{" "}
              <Link href="/legal" className="underline-offset-2 hover:underline">
                Mentions légales
              </Link>
            </p>
          </div>
          <div className="flex items-end gap-3">
            <ViewReadout />
            <GeolocationControl />
            <MapControls />
          </div>
        </footer>

        {/* Contenu de page (overlays) */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </main>
  )
}
