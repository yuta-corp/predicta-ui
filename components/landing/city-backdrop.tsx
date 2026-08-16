"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useMotionValue, useSpring } from "motion/react"

import { TANA_CENTER } from "@/lib/geo"
import { cn } from "@/lib/utils"

// La même carte que /map — l'instance UNIQUE de la landing, fixée derrière
// toute la page. C'est le personnage principal : elle ne disparaît jamais.
const CityMap = dynamic(
  () => import("@/components/map/city-map").then((m) => m.CityMap),
  { ssr: false }
)

/** Une étape de la narration — la caméra se déplace avec le récit. */
interface Chapter {
  /** id de la section qui déclenche le mouvement. */
  id: string
  center: [number, number]
  zoom: number
  pitch?: number
  duration?: number
}

/**
 * La chorégraphie caméra de toute la page — du ciel de la ville le matin
 * jusqu'au retour au plan d'ensemble. Le scroll est le conducteur :
 * chaque chapitre reçoit sa caméra quand on entre dans sa section.
 */
const CHAPTERS: Chapter[] = [
  { id: "hero", center: TANA_CENTER, zoom: 12.6, duration: 2200 },
  { id: "ville-jamais", center: TANA_CENTER, zoom: 12.9, duration: 2000 },
  { id: "voir-tana", center: [47.5245, -18.9095], zoom: 13.4, duration: 1800 },
  { id: "chaque-route", center: [47.5265, -18.9075], zoom: 13.8, duration: 2000 },
  { id: "construire-dessus", center: [47.5265, -18.9075], zoom: 14.1, duration: 1800 },
  { id: "deux-entrees", center: [47.526, -18.909], zoom: 14.0, duration: 1600 },
  { id: "recherche", center: [47.5269, -18.9079], zoom: 14.5, duration: 2000 },
  { id: "build-api", center: TANA_CENTER, zoom: 13.6, duration: 1800 },
  { id: "angle", center: TANA_CENTER, zoom: 12.4, pitch: 50, duration: 2600 },
  { id: "pourquoi", center: TANA_CENTER, zoom: 12.1, pitch: 28, duration: 2000 },
  { id: "futur", center: TANA_CENTER, zoom: 11.7, pitch: 10, duration: 2000 },
  { id: "final", center: TANA_CENTER, zoom: 11.1, pitch: 0, duration: 2800 },
]

/** Sections où la carte redevient une INTERFACE (clic, survol). */
const WINDOW_IDS = ["voir-tana", "recherche"] as const

const DRIFT_MS = 14_000
const IDLE_AFTER_INTERACTION_MS = 8_000

/**
 * Ville de fond — la carte unique derrière tout le récit.
 *
 * - Caméra pilotée par le scroll (chapitres mesurés sur les sections réelles).
 * - Parallaxe au curseur : la ville répond, sans jamais gêner.
 * - Fenêtres interactives : la carte reprend la souris uniquement là où elle
 *   devient le produit (Voir Tana bouger, la recherche de quartiers).
 */
export function CityBackdrop() {
  const [mapReady, setMapReady] = useState(false)
  const mapActiveRef = useRef(false)
  const [mapActive, setMapActive] = useState(false)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const parallaxX = useSpring(px, { stiffness: 46, damping: 18, mass: 0.5 })
  const parallaxY = useSpring(py, { stiffness: 46, damping: 18, mass: 0.5 })

  // --- Parallaxe au curseur : la ville s'incline d'un souffle ---
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return
    const onMove = (e: MouseEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * -12)
      py.set((e.clientY / window.innerHeight - 0.5) * -8)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [px, py])

  // --- Fenêtres interactives : la carte reprend la souris ---
  useEffect(() => {
    if (!mapReady) return
    const targets = WINDOW_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (targets.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        const active = entries.some((e) => e.isIntersecting)
        mapActiveRef.current = active
        setMapActive(active)
      },
      { rootMargin: "-12% 0px -12% 0px" }
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [mapReady])

  // --- Le réalisateur : le scroll conduit la caméra ---
  useEffect(() => {
    if (!mapReady) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let lastChapter = -1
    let raf = 0
    let transitionUntil = 0
    let interactingUntil = 0

    let liveMap: ReturnType<
      typeof import("@/components/map/city-map").getLiveMap
    > | null = null
    void import("@/components/map/city-map").then(({ getLiveMap }) => {
      liveMap = getLiveMap()
      if (!liveMap) return
      liveMap.on("mousedown", markInteraction)
      liveMap.on("wheel", markInteraction)
      liveMap.on("touchstart", markInteraction)
      liveMap.on("dragstart", markInteraction)
    })

    const markInteraction = () => {
      interactingUntil = performance.now() + IDLE_AFTER_INTERACTION_MS
    }

    const measureProgress = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      return total > 0 ? window.scrollY / total : 0
    }

    const drive = () => {
      const progress = measureProgress()
      let active = 0
      for (let i = 0; i < CHAPTERS.length; i++) {
        const el = document.getElementById(CHAPTERS[i].id)
        if (!el) continue
        const top =
          el.getBoundingClientRect().top +
          window.scrollY +
          el.offsetHeight * 0.42
        const total = document.documentElement.scrollHeight - window.innerHeight
        if (total > 0 && top / total <= progress) active = i
      }
      if (active === lastChapter) return
      lastChapter = active
      if (reduced || !liveMap) return
      const c = CHAPTERS[active]
      transitionUntil = performance.now() + (c.duration ?? 1600) + 900
      liveMap.easeTo({
        center: c.center,
        zoom: c.zoom,
        pitch: c.pitch ?? 0,
        duration: c.duration ?? 1600,
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(drive)
    }

    // Dérive lente quand rien ne se passe — la ville respire, jamais immobile.
    const driftTimer = setInterval(() => {
      if (reduced || mapActiveRef.current || !liveMap) return
      if (performance.now() < transitionUntil) return
      if (performance.now() < interactingUntil) return
      if (lastChapter < 0) return
      const c = CHAPTERS[lastChapter]
      const t = Date.now()
      liveMap.easeTo({
        center: [
          c.center[0] + 0.005 * Math.sin(t / 43_000),
          c.center[1] + 0.0035 * Math.cos(t / 53_000),
        ],
        zoom: c.zoom + 0.025 * Math.sin(t / 39_000),
        duration: 13_000,
      })
    }, DRIFT_MS)

    drive()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(driftTimer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (liveMap) {
        liveMap.off("mousedown", markInteraction)
        liveMap.off("wheel", markInteraction)
        liveMap.off("touchstart", markInteraction)
        liveMap.off("dragstart", markInteraction)
      }
    }
  }, [mapReady])

  return (
    <motion.div
      aria-hidden
      className={cn(
        "fixed -inset-4 z-0 will-change-transform",
        mapActive ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{ x: parallaxX, y: parallaxY }}
    >
      <div className="absolute inset-0">
        <CityMap
          forceLight
          interactive
          showControls={false}
          onReady={() => setMapReady(true)}
          className="h-full w-full"
        />
      </div>
      {/* Vignette de profondeur — la ville reste lisible sous la typographie. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(20,26,12,0.18)_100%)]" />
    </motion.div>
  )
}
