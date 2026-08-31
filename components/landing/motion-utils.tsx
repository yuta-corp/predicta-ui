"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { initGsap, PREDICTA_EASE } from "@/lib/gsap-setup"
import { cn } from "@/lib/utils"

initGsap()

/** Easing array — pour compatibilité avec les composants qui importent EASE. */
export const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Kicker — étiquette éditoriale section, grise, espacée, discrète.
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
 * LineReveal — titre révélé par clip-path au scroll (GSAP ScrollTrigger).
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
  const innerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.9,
        ease: PREDICTA_EASE,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    )
  }, [delay])

  return (
    <Tag className={cn("block", className)}>
      <span ref={innerRef} className="block will-change-[clip-path]">
        {children}
      </span>
    </Tag>
  )
}

/**
 * FadeUp — apparition douce au scroll (GSAP ScrollTrigger).
 */
export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: PREDICTA_EASE,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    )
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
