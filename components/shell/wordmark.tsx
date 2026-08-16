import Link from "next/link"
import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  href?: string
  /** lg = marque pleine (héros, boucle finale) ; sm = chrome (en-tête, pied). */
  size?: "sm" | "lg"
}

/**
 * Logotype Predicta — le logo (bloc lime aux formes de ville) + le mot.
 * Le logo respire lentement (la marque du vivant), coupé en reduced-motion.
 */
export function Wordmark({ className, href = "/", size = "sm" }: WordmarkProps) {
  const large = size === "lg"
  const mark = (
    <span
      className={cn(
        "inline-flex items-center",
        large ? "gap-3.5" : "gap-2.5",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        aria-hidden
        className={cn(
          "animate-breathe shrink-0 select-none",
          large ? "h-10 w-10 sm:h-12 sm:w-12" : "h-6 w-6"
        )}
        draggable={false}
      />
      <span
        className={cn(
          "font-bold uppercase tracking-[0.22em] text-foreground",
          large ? "text-[clamp(1.35rem,3.2vw,2rem)]" : "text-[13px]"
        )}
      >
        Predicta
      </span>
      <span
        aria-hidden
        className={cn(
          "self-center bg-primary",
          large ? "h-[5px] w-6" : "h-[3px] w-3"
        )}
      />
    </span>
  )
  return (
    <Link href={href} className="shrink-0" aria-label="Predicta — accueil">
      {mark}
    </Link>
  )
}
