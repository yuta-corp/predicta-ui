"use client"

import type { ReactNode } from "react"

import { useReveal } from "@/lib/motion/use-reveal"
import { cn } from "@/lib/utils"

/** Révélation au scroll — enveloppe légère autour de useReveal. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
