"use client"

import { useState } from "react"

import { useReveal } from "@/lib/motion/use-reveal"
import { congestionLabel } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * De la donnée brute à la ville.
 *
 * Une feature GeoJSON — telle que l'API la renvoie réellement — et la route
 * qu'elle décrit, qui se dessine puis vit. Survolez une propriété : la
 * route répond. rate pilote la couleur et le mouvement (signal lime),
 * speed s'affiche en lecture directe.
 */

// Feature illustrative (même forme que les réponses /traffic réelles).
const FEATURE = {
  type: "Feature",
  properties: {
    name: "Avenue de l'Indépendance",
    quartierId: "rel_999999",
    speed: 32,
    rate: 0.9,
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [47.526, -18.909],
      [47.529, -18.907],
    ],
  },
} as const

type PropKey = "rate" | "speed"

export function RoadFromData() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [hovered, setHovered] = useState<PropKey | null>(null)

  const rate = FEATURE.properties.rate
  const speed = FEATURE.properties.speed
  // La couleur suit la palette de la carte : rate 0.9 = fluide = lime.
  // (Le survol de rate ralentit le flux et affiche la lecture directe.)
  const roadColor = "#9fca69"

  return (
    <div
      ref={ref}
      className={cn(
        "reveal grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center",
        visible && "is-visible"
      )}
    >
      {/* ---- La donnée brute : la feature GeoJSON ---- */}
      <div className="overflow-hidden rounded-md border border-border/80 bg-[#0b0d09] text-[#e8f0dd]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="font-mono text-[11px] tracking-wide text-[#9aa892]">
            feature.geojson
          </span>
          <span className="font-mono text-[11px] text-[#9aa892]">
            GET /traffic
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.8]">
          <code>
            <Line depth={0} text='{ "type": "Feature",' />
            <Line depth={1} text='"properties": {' />
            <Line
              depth={2}
              text={`"name": "${FEATURE.properties.name}",`}
              string
            />
            <Line
              depth={2}
              text={`"quartierId": "${FEATURE.properties.quartierId}",`}
              string
            />
            <Line
              depth={2}
              text={`"speed": ${speed},`}
              number
              hovered={hovered === "speed"}
              onEnter={() => setHovered("speed")}
              onLeave={() => setHovered(null)}
            />
            <Line
              depth={2}
              text={`"rate": ${rate}`}
              number
              hovered={hovered === "rate"}
              onEnter={() => setHovered("rate")}
              onLeave={() => setHovered(null)}
            />
            <Line depth={1} text="}," />
            <Line depth={1} text='"geometry": {' />
            <Line depth={2} text='"type": "LineString",' string />
            <Line depth={2} text={`"coordinates": [${FEATURE.geometry.coordinates.map(([lon, lat]) => `[${lon}, ${lat}]`).join(", ")}]`} number />
            <Line depth={1} text="}" />
            <Line depth={0} text="}" />
          </code>
        </pre>
      </div>

      {/* ---- La ville : la route qu'elle décrit ---- */}
      <div className="flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-md border border-border/70 bg-[#0b0d09]">
          {/* Graticule discret */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(226,240,208,0.09) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <svg
            viewBox="0 0 360 200"
            role="img"
            aria-label="La route décrite par la feature GeoJSON"
            className="relative block h-auto w-full"
          >
            <path
              d="M 28 168 C 84 96, 140 40, 200 84 S 316 36, 332 30"
              fill="none"
              strokeLinecap="round"
              className="road-draw"
              stroke="rgba(226,240,208,0.16)"
              strokeWidth={13}
            />
            <path
              d="M 28 168 C 84 96, 140 40, 200 84 S 316 36, 332 30"
              fill="none"
              strokeLinecap="round"
              className="road-draw"
              style={{ stroke: roadColor }}
              strokeWidth={5.5}
            />
            {/* Flux — le trafic qui coule sur la route */}
            <path
              d="M 28 168 C 84 96, 140 40, 200 84 S 316 36, 332 30"
              fill="none"
              strokeLinecap="round"
              className={cn("road-flow", hovered === "rate" && "road-flow-slow")}
              style={{ stroke: roadColor }}
              strokeWidth={5.5}
            />
          </svg>

          {/* Lecture directe au survol */}
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-background/70 px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-foreground/90 backdrop-blur-sm">
            {hovered === "rate" ? (
              <span>
                rate {rate.toFixed(2)} · {congestionLabel(rate)}
              </span>
            ) : hovered === "speed" ? (
              <span>{speed} km/h</span>
            ) : (
              <span className="text-muted-foreground">survolez une propriété</span>
            )}
          </div>
        </div>
        <p className="max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
          Un segment trafic est une ligne portant la vitesse observée et{" "}
          <code className="font-mono text-lime-ink">rate</code> — le ratio
          vitesse observée / vitesse libre. La couleur et le mouvement de la
          route naissent de ces deux nombres.
        </p>
      </div>
    </div>
  )
}

function Line({
  depth,
  text,
  string: isString,
  number: isNumber,
  hovered,
  onEnter,
  onLeave,
}: {
  depth: number
  text: string
  string?: boolean
  number?: boolean
  hovered?: boolean
  onEnter?: () => void
  onLeave?: () => void
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "flex rounded-sm px-2 transition-colors",
        hovered && "bg-primary/15"
      )}
    >
      <span className="w-4 shrink-0 select-none text-[#54584e]">
        {" ".repeat(depth)}
      </span>
      <span
        className={cn(
          isString && "text-[#e8f0dd]",
          isNumber && "text-[#e0b25c]",
          !isString && !isNumber && "text-[#9fca69]"
        )}
      >
        {text}
      </span>
    </div>
  )
}
