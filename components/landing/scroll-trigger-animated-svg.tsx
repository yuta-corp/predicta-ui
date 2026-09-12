"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import gsap from "gsap"

import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"

initGsap()

/** Ressource SVG des contours de Tana. */
const CONTOURS_SVG_URL = "/svg/tana-contours.svg"

interface ScrollTriggerAnimatedSVGProps {
  /** Élément déclencheur du scroll (la section héros, en général). */
  triggerRef: RefObject<HTMLElement | null>
  /** Classes de l'enveloppe SVG. */
  className?: string
}

/** Charge le texte du SVG. Renvoie null tant qu'il n'est pas prêt. */
function useSvgSource(): { svgText: string | null; failed: boolean } {
  const [svgText, setSvgText] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(CONTOURS_SVG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setSvgText(text)
      })
      .catch((err) => {
        if (cancelled) return
        console.warn("Could not load SVG for ScrollTriggerAnimatedSVG:", err)
        setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { svgText, failed }
}

/**
 * Dessine les contours au rythme du scroll : chaque chemin reçoit une longueur
 * de tiret égale à son périmètre, puis le décalage descend à zéro.
 */
function drawContoursOnScroll(
  trigger: HTMLElement,
  container: HTMLDivElement
): (() => void) | null {
  const svg = container.querySelector("svg")
  if (!svg) return null
  const paths = svg.querySelectorAll("path")
  if (paths.length === 0) return null

  const ctx = gsap.context(() => {
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
    })

    gsap
      .timeline({
        scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: true },
      })
      .to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: PREDICTA_EASE,
          stagger: { amount: 0.3, from: "random", grid: "auto", ease: "power1.inOut" },
        },
        0
      )
  }, container)

  return () => ctx.revert()
}

/**
 * Contours de Tana dessinés au scroll du héros. Le conteneur est rendu dès le
 * premier rendu (sinon la ref resterait nulle et le SVG ne serait jamais
 * injecté) ; le contenu n'arrive qu'ensuite.
 */
export function ScrollTriggerAnimatedSVG({
  triggerRef,
  className = "",
}: ScrollTriggerAnimatedSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { svgText, failed } = useSvgSource()

  // Injection + animation : dépend du texte chargé et du conteneur monté.
  useEffect(() => {
    const container = containerRef.current
    const trigger = triggerRef.current
    if (!svgText || !container || !trigger) return
    container.innerHTML = svgText
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Laisse le navigateur parser le SVG injecté avant de mesurer les chemins.
    let cleanup: (() => void) | null = null
    const timer = setTimeout(() => {
      cleanup = drawContoursOnScroll(trigger, container)
    }, 100)
    return () => {
      clearTimeout(timer)
      cleanup?.()
    }
  }, [svgText, triggerRef])

  if (failed) return null

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-[9] ${className}`}
      aria-hidden="true"
    />
  )
}
