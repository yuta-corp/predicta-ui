import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * GSAP setup — enregistre les plugins une seule fois.
 * À importer dans chaque composant client qui utilise GSAP.
 */
let initialized = false

export function initGsap() {
  if (initialized) return
  if (typeof window === "undefined") return
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: "power3.out" })
  initialized = true
}

/** Easing Predicta — cubic-bezier(.16,1,.3,1). */
export const PREDICTA_EASE = "power3.out"
