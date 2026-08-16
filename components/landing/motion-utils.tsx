"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

/** Easing signature de la marque — lent, précis, jamais décoratif. */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Petite étiquette éditoriale — même voix partout : gris, espacée, discrète.
 * La lime reste un SIGNAL (mouvement, données, sélection) ; les étiquettes
 * de section ne sont ni des signaux ni des ornements, elles cadrent.
 */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/50",
        className
      )}
    >
      {children}
    </p>
  )
}

/**
 * Titre éditorial révélé ligne par ligne — la ligne se démasque depuis le bas,
 * comme une route qui se dessine. Un seul passage, léger.
 *
 * Le masque est un clip-path (inset) : aucun calcul de taille, fiable sur
 * toute la page, coupé par MotionConfig en reduced-motion.
 */
export function LineReveal({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "div"
}) {
  return (
    <Tag className={cn("block", className)}>
      <motion.span
        className="block will-change-[clip-path]"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}

/** Apparition douce au scroll — pour les blocs secondaires, jamais pour les titres. */
export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Progression d'une section dans le viewport (0 = entrée, 1 = sortie).
 * Pilote les effets liés au scroll (sortie du titre du héros, profondeur…).
 */
export function useSectionProgress() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  return { ref, scrollYProgress }
}


