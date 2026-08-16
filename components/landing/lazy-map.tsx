"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Même carte que /map — le produit réel, pas une capture.
const CityMap = dynamic(
  () => import("@/components/map/city-map").then((m) => m.CityMap),
  { ssr: false }
)

interface LazyMapProps {
  className?: string
  /** Dérive lente de la caméra. */
  drift?: boolean
  /** Clics → sélection / scan (comportement produit). */
  interactive?: boolean
}

/**
 * Carte montée à la demande : la section « Voir Tana bouger » n'instancie la
 * carte (MapLibre + style OpenFreeMap) que lorsqu'elle approche du viewport.
 * Le premier écran reste ainsi léger et le scroll reste à 60 fps.
 */
export function LazyMap({
  className,
  drift = false,
  interactive = true,
}: LazyMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: "900px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {show && <CityMap drift={drift} interactive={interactive} />}
    </div>
  )
}
