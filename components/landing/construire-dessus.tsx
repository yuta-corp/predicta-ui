"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import {
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"
import { cn } from "@/lib/utils"

/**
 * Scène 05 — VOIR LA DONNÉE. CONSTRUIRE DESSUS.
 *
 * La même route, deux regards : la feature GeoJSON telle que l'API la
 * renvoie, et le segment qu'elle décrit. Survolez l'une — l'autre répond.
 * Pas deux cartes côte à côte : une seule route, vue depuis les deux côtés
 * de l'écran.
 */
export function ConstruireDessus() {
  const [hovered, setHovered] = useState<"geometry" | "road" | null>(null)

  return (
    <section
      id="construire-dessus"
      aria-label="Voir la donnée, construire dessus"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Kicker>Pour les développeurs</Kicker>
        <LineReveal
          className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
          delay={0}
        >
          Voir la donnée.
        </LineReveal>
        <LineReveal
          className="max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
          delay={0.12}
        >
          Construire dessus.
        </LineReveal>
        <FadeUp className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          Le trafic de la carte, en GeoJSON (RFC 7946) — la même route que vous
          voyez bouger, servie telle quelle à vos applications.
        </FadeUp>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
          {/* ---- La feature, telle que l'API la renvoie ---- */}
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
                <JsonLine depth={0} text='{ "type": "Feature",' />
                <JsonLine depth={1} text='"properties": {' />
                <JsonLine
                  depth={2}
                  text={`"name": "Avenue de l'Indépendance",`}
                  string
                />
                <JsonLine depth={2} text='"quartierId": "rel_999999",' string />
                <JsonLine depth={2} text='"speed": 32,' number />
                <JsonLine depth={2} text='"rate": 0.9' number />
                <JsonLine depth={1} text="}," />
                <JsonLine
                  depth={1}
                  text='"geometry": {'
                  hovered={hovered === "road"}
                  onEnter={() => setHovered("geometry")}
                  onLeave={() => setHovered(null)}
                />
                <JsonLine
                  depth={2}
                  text='"type": "LineString",'
                  string
                  hovered={hovered === "road"}
                  onEnter={() => setHovered("geometry")}
                  onLeave={() => setHovered(null)}
                />
                <JsonLine
                  depth={2}
                  text='"coordinates": [[47.526, -18.909], [47.529, -18.907]]'
                  number
                  hovered={hovered === "road"}
                  onEnter={() => setHovered("geometry")}
                  onLeave={() => setHovered(null)}
                />
                <JsonLine depth={1} text="}" />
                <JsonLine depth={0} text="}" />
              </code>
            </pre>
          </div>

          {/* ---- La route qu'elle décrit, vue comme une carte ---- */}
          <RoadExcerpt
            active={hovered === "geometry"}
            onHover={() => setHovered("road")}
            onLeave={() => setHovered(null)}
          />
        </div>

        {/* Une ville. Des applications infinies. */}
        <div className="mt-20 border-t border-border/60 pt-10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9 }}
            className="text-[clamp(1.6rem,3.6vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] text-foreground"
          >
            Une ville.
            <br />
            <span className="text-lime-ink">Des applications infinies.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-5"
          >
            <Link
              href="/developers"
              className="group inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Lire la documentation
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/developers/explorer"
              className="text-[13.5px] text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary"
            >
              Explorateur GeoJSON
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Une ligne du JSON — les lignes de géométrie répondent au survol de la route. */
function JsonLine({
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
          !isString && !isNumber && "text-[#9fca69]",
          hovered && "text-primary"
        )}
      >
        {text}
      </span>
    </div>
  )
}

/** Extrait de carte : la route se détache d'un réseau discret. */
function RoadExcerpt({
  active,
  onHover,
  onLeave,
}: {
  active: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border/70 bg-[#0b0d09]"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
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
        viewBox="0 0 560 360"
        role="img"
        aria-label="La route décrite par la feature GeoJSON"
        className="relative block h-full w-full"
      >
        {/* Le reste du réseau — présent, jamais dominant */}
        <path
          d="M 40 90 C 140 110, 210 70, 300 92 S 480 60, 540 96"
          fill="none"
          stroke="rgba(226,240,208,0.12)"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M 90 330 C 170 280, 130 220, 210 180 S 350 160, 430 220"
          fill="none"
          stroke="rgba(226,240,208,0.1)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* La route : deux traits, l'un pour la zone de survol, l'autre pour le rendu */}
        <path
          d="M 70 290 C 150 240, 210 180, 280 150 S 430 70, 500 44"
          fill="none"
          stroke="transparent"
          strokeWidth={26}
          strokeLinecap="round"
          className="cursor-pointer"
        />
        <motion.path
          d="M 70 290 C 150 240, 210 180, 280 150 S 430 70, 500 44"
          fill="none"
          strokeLinecap="round"
          animate={{ stroke: active ? "#c0fe71" : "#9fca69" }}
          transition={{ duration: 0.35 }}
          strokeWidth={active ? 7 : 5}
        />
        {/* Flux de trafic sur la route */}
        <motion.path
          d="M 70 290 C 150 240, 210 180, 280 150 S 430 70, 500 44"
          fill="none"
          strokeLinecap="round"
          stroke="#c0fe71"
          strokeWidth={5}
          strokeDasharray="3 18"
          animate={{ strokeDashoffset: [0, -420] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          opacity={active ? 0.9 : 0.45}
        />
        {/* Nœuds de la géométrie */}
        {[
          [70, 290],
          [280, 150],
          [500, 44],
        ].map(([x, y], i) => (
          <g key={i}>
            <motion.line
              x1={x - 7}
              y1={y}
              x2={x + 7}
              y2={y}
              stroke={active ? "#c0fe71" : "#9aa892"}
              strokeWidth={1.4}
              animate={{ opacity: active ? 1 : 0.55 }}
            />
            <motion.line
              x1={x}
              y1={y - 7}
              x2={x}
              y2={y + 7}
              stroke={active ? "#c0fe71" : "#9aa892"}
              strokeWidth={1.4}
              animate={{ opacity: active ? 1 : 0.55 }}
            />
          </g>
        ))}
        {/* Coordonnées — la géométrie, lisible */}
        <text
          x={86}
          y={308}
          fill={active ? "#c0fe71" : "#6f7a63"}
          fontSize={9.5}
          fontFamily="var(--font-mono)"
        >
          [47.526, -18.909]
        </text>
        <text
          x={474}
          y={34}
          fill={active ? "#c0fe71" : "#6f7a63"}
          fontSize={9.5}
          fontFamily="var(--font-mono)"
          textAnchor="end"
        >
          [47.529, -18.907]
        </text>
      </svg>
    </div>
  )
}
