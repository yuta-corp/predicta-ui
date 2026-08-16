"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import {
  FadeUp,
  Kicker,
  LineReveal,
} from "@/components/landing/motion-utils"

const ENDPOINTS = [
  ["GET", "/traffic", "État du trafic de toute la ville (usage rare, ~50 Mo)."],
  ["PUT", "/traffic/zone", "Trafic autour d'un centroïde — disque, 2 tuiles."],
  [
    "GET",
    "/traffic/quartier/{quartierId}",
    "Trafic précis d'un quartier, cache 45 s.",
  ],
  ["GET", "/quartiers?q=", "Recherche de quartiers, 372 au catalogue."],
] as const

/**
 * Scène 08 — CONSTRUIRE AVEC PREDICTA.
 *
 * La requête traverse le système : code → Predicta → GeoJSON → carte.
 * Les endpoints listés sont ceux de docs/api.yml — rien d'inventé.
 */
export function BuildApi() {
  return (
    <section
      id="build-api"
      aria-label="Construire avec Predicta"
      className="relative border-t border-border/60 bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Kicker>L'API</Kicker>
        <LineReveal className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground">
          Construire avec Predicta.
        </LineReveal>
        <FadeUp className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          Le trafic de Tana pour ce que vous construisez ensuite — des
          applications qui comprennent comment la ville bouge. Une requête, et
          la route que vous regardez devient la vôtre.
        </FadeUp>

        {/* La requête traverse le système */}
        <div className="mt-16">
          <RequestPipeline />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          {/* Points d'entrée réels */}
          <div className="flex flex-col">
            {ENDPOINTS.map(([method, path, summary], i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="border-b border-border/60 py-5 first:border-t"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[13px] font-medium text-lime-ink">
                    {method}
                  </span>
                  <code className="font-mono text-[14px] text-foreground">
                    {path}
                  </code>
                </div>
                <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
                  {summary}
                </p>
              </motion.div>
            ))}
            <FadeUp className="mt-8">
              <Link
                href="/developers"
                className="group inline-flex items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-lime-ink"
              >
                Voir la documentation complète
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </FadeUp>
          </div>

          {/* Le même trafic, dans votre carte — le snippet réel */}
          <FadeUp>
            <div className="overflow-hidden rounded-md border border-border/80 bg-[#0b0d09] text-[#e8f0dd]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <span className="font-mono text-[11px] tracking-wide text-[#9aa892]">
                  map.ts
                </span>
                <span className="font-mono text-[11px] text-[#9aa892]">
                  MapLibre GL
                </span>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-[1.8]">
                <code>{`// Le trafic d'Antananarivo, directement dans votre carte.
map.addSource("predicta-traffic", {
  type: "vector",
  tiles: ["https://api.predicta.mg/traffic/tile/{z}/{x}/{y}.mvt"],
  minzoom: 12, maxzoom: 16,
});

map.addLayer({
  id: "traffic",
  type: "line",
  source: "predicta-traffic",
  "source-layer": "speeds",
  paint: { "line-color": ["get", "rate"] >= 0.75 ? "#9fca69" : "#dd6a4c" },
});`}</code>
              </pre>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

/** Code → Predicta → GeoJSON → carte : une requête qui traverse le système. */
function RequestPipeline() {
  const NODES = [
    { label: "Requête", code: "GET /traffic" },
    { label: "Predicta API", code: "tuiles MVT → GeoJSON" },
    { label: "GeoJSON", code: "RFC 7946 · speeds" },
    { label: "Votre carte", code: "la ville, chez vous" },
  ] as const

  return (
    <div className="relative overflow-hidden rounded-md border border-border/60 bg-[#0b0d09] px-6 py-10 sm:px-10">
      {/* La ligne que la requête emprunte */}
      <div
        aria-hidden
        className="absolute inset-x-10 top-1/2 h-px bg-foreground/12"
      />
      {/* La requête voyage — un signal qui traverse le système */}
      <motion.div
        aria-hidden
        className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_rgba(192,254,113,0.9)]"
        animate={{ left: ["8%", "92%"] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      />
      <div className="relative grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {NODES.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.22 }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aa892]">
              {node.label}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#e8f0dd]/80">
              {node.code}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
