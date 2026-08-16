"use client"

import { useEffect, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import { ChevronDownIcon, CopyIcon, XIcon } from "lucide-react"
import { useTraffic } from "@/hooks/use-traffic"
import {
  congestionLabel,
  formatRate,
  formatSpeed,
} from "@/lib/format"
import { quartiersById } from "@/lib/data/quartiers"
import { cn } from "@/lib/utils"

/** Détails d'une route sélectionnée — hiérarchie typographique, zéro badge. */
export function RoutePanel() {
  const { engine, state } = useTraffic()
  const [showGeo, setShowGeo] = useState(false)
  const [copied, setCopied] = useState(false)

  const selected = state.selected
  if (!selected) return null

  // Feature la plus fraîche (le refresh SWR met à jour le store).
  const live = engine.store.lookupByKey(selected.id)
  const feature = live?.feature ?? selected.feature
  const props = feature.properties
  const speed = formatSpeed(props.speed)
  const rate = formatRate(props.rate)
  // Quartier résolu depuis l'id exposé par la feature (l'index est local,
  // zéro requête supplémentaire).
  const quartierName =
    selected.quartierName ??
    (props.quartierId ? quartiersById[props.quartierId]?.name : null) ??
    null
  const geoJson = JSON.stringify(feature, null, 2)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(geoJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <aside
      className="animate-rise pointer-events-auto flex max-h-[calc(100dvh-8rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-background/90 shadow-[0_24px_64px_rgba(30,40,20,0.18)] backdrop-blur-md"
      aria-label="Détails de la route sélectionnée"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Route sélectionnée
          </p>
          <h2 className="mt-1 truncate text-[17px] font-semibold tracking-tight text-foreground">
            {props.name || "Route sans nom"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => engine.clearSelection()}
          className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fermer les détails"
        >
          <XIcon className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Vitesse observée
          </p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <AnimatedNumber
              value={speed}
              className="text-[44px] font-semibold leading-none tracking-tight tabular-nums text-foreground"
            />
            <span className="text-[13px] text-muted-foreground">km/h</span>
          </p>
        </div>
        <div className="pb-1 text-right">
          <p
            className={cn(
              "text-[13.5px] font-medium",
              typeof props.rate === "number" && props.rate < 0.5
                ? "text-[#c4503a]"
                : "text-foreground/90"
            )}
          >
            {congestionLabel(props.rate)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {typeof props.rate === "number" ? `Taux ${rate}` : "Taux indisponible"}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 border-t border-border/70 px-5 py-3.5 text-[12.5px]">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Quartier
          </dt>
          <dd className="mt-0.5 truncate text-foreground">
            {quartierName ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Données de
          </dt>
          <dd className="mt-0.5 truncate text-foreground">
            {selected.label || quartierName || "—"}
          </dd>
        </div>
      </dl>

      <div className="border-t border-border/70">
        <button
          type="button"
          onClick={() => setShowGeo((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={showGeo}
        >
          <span className="font-medium">Voir le GeoJSON</span>
          <ChevronDownIcon
            className={cn("h-4 w-4 transition-transform", showGeo && "rotate-180")}
            aria-hidden
          />
        </button>
        {showGeo && (
          <div className="relative border-t border-border/70">
            <pre className="max-h-56 overflow-auto bg-muted/70 px-5 py-3.5 font-mono text-[10.5px] leading-relaxed text-foreground/80">
              {geoJson}
            </pre>
            <button
              type="button"
              onClick={copy}
              className="absolute right-3 top-3 rounded-sm border border-border/80 bg-background/80 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
              aria-label="Copier le GeoJSON"
            >
              {copied ? (
                <span className="px-0.5 text-[10px] font-medium text-lime-ink">Copié</span>
              ) : (
                <CopyIcon className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

/**
 * Vitesse animée — le chiffre glisse de sa valeur précédente vers la nouvelle
 * (le refresh SWR met la route à jour toutes les 45 s). Instantané si la
 * valeur n'est pas un nombre (donnée absente).
 */
function AnimatedNumber({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const num = Number(value)
  const finite = Number.isFinite(num) && !reducedMotion
  // La motion value démarre sur la valeur affichée : chaque mise à jour glisse
  // du chiffre courant vers le nouveau (init d'état, pas de ref en rendu).
  const [initial] = useState(() => (finite ? num : 0))
  const mv = useMotionValue(initial)
  const text = useTransform(mv, (v) =>
    finite ? String(Math.round(v)) : value
  )

  useEffect(() => {
    if (!finite) return
    const controls = animate(mv, num, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [finite, mv, num])

  return <motion.span className={className}>{text}</motion.span>
}
