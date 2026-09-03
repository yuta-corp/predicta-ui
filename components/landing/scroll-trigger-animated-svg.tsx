"use client"

import { useEffect, useRef, useState, RefObject } from "react"
import gsap from "gsap"
import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"

initGsap()

interface ScrollTriggerAnimatedSVGProps {
  /** Reference to the hero section (or any trigger element) */
  triggerRef: RefObject<HTMLElement | null>
  /** Optional: className for the SVG wrapper */
  className?: string
}

export function ScrollTriggerAnimatedSVG({
  triggerRef,
  className = "",
}: ScrollTriggerAnimatedSVGProps) {
  const svgRef = useRef<HTMLDivElement>(null)
  const [svgLoaded, setSvgLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    // Fetch the SVG
    fetch("/svg/tana-contours.svg")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`)
        return res.text()
      })
      .then((text) => {
        // Set the SVG content via innerHTML
        if (svgRef.current) {
          svgRef.current.innerHTML = text
          setSvgLoaded(true)
          setLoadError(false)
        }
      })
      .catch((err) => {
        console.warn("Could not load SVG for ScrollTriggerAnimatedSVG:", err)
        setLoadError(true)
        setSvgLoaded(false)
      })
  }, [])

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger || !svgLoaded || loadError) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // If reduced motion, we still want to show the SVG but without animation
      return
    }

    // Wait for the SVG to be loaded in the DOM (already set in the fetch effect)
    // We'll use a small timeout to ensure the SVG is parsed
    const timeoutId = setTimeout(() => {
      const svgElement = svgRef.current?.querySelector("svg")
      if (!svgElement) return

      // Select all path elements in the SVG
      const paths = svgElement.querySelectorAll("path")
      if (paths.length === 0) return

      // Prepare GSAP context and store its cleanup function
      const ctx = gsap.context(() => {
        // Calculate the total length of each path and set up stroke-dasharray and stroke-dashoffset
        paths.forEach((path) => {
          const length = (path as SVGPathElement).getTotalLength()
          // Set initial state for drawing: stroke-dashoffset = length, stroke-dasharray = length
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          })
        })

        // Create a timeline that animates the strokeDashoffset from length to 0
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "bottom top",
            scrub: true, // smooth scrubbing
            // markers: true, // for debugging
          },
        })

        // Animate all paths simultaneously (or stagger if desired)
        tl.to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 0.8, // slightly faster relative to scroll progress
            ease: PREDICTA_EASE,
            stagger: {
              amount: 0.3, // total delay spread over all paths
              from: "random",
              grid: "auto",
              ease: "power1.inOut",
            },
          },
          0
        )
      }, svgRef) // bind context to the svgRef element for cleanup
      gsapCleanup = () => ctx.revert()
    }, 100)

    let gsapCleanup: (() => void) | null = null

    // Cleanup function for the useEffect
    return () => {
      clearTimeout(timeoutId)
      gsapCleanup?.()
    }
  }, [triggerRef, svgLoaded, loadError])

  if (loadError) {
    // Optionally render a fallback or nothing
    return null
  }

  // While loading, we render nothing (or a placeholder)
  if (!svgLoaded) {
    return null
  }

  return (
    <div
      ref={svgRef}
      className={`pointer-events-none absolute inset-0 z-[9] ${className}`}
      aria-hidden="true"
    >
      {/* SVG will be injected here */}
    </div>
  )
}