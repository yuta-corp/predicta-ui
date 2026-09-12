"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TOUR_OPEN_EVENT } from "@/components/tour/tour-open"
import { TOUR_STEPS } from "@/components/tour/steps"
import { cn } from "@/lib/utils"

const DONE_KEY = "predicta-tour-done"
const LAUNCH_DELAY = 900
const SPOT_PAD = 6
const CARD_GAP = 14
const VIEWPORT_MARGIN = 16

interface CardSize {
  width: number
  height: number
}

function tourDone(): boolean {
  if (typeof window === "undefined") return true
  try {
    return window.localStorage.getItem(DONE_KEY) === "1"
  } catch {
    return true
  }
}

function findTargetRect(selector?: string): DOMRect | null {
  if (!selector) return null
  const el = document.querySelector(selector)
  return el ? el.getBoundingClientRect() : null
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/** Positionne la carte près de la cible, en restant dans la fenêtre. */
function placeCard(
  rect: DOMRect,
  width: number,
  height: number,
  vw: number,
  vh: number
): { top: number; left: number } {
  const preferRight = vw - (rect.left + rect.width) >= width + VIEWPORT_MARGIN * 2
  const preferLeft = rect.left >= width + VIEWPORT_MARGIN * 2
  const preferBottom = vh - (rect.top + rect.height) >= height + CARD_GAP
  const preferTop = rect.top >= height + CARD_GAP
  const cx = clamp(
    rect.left + rect.width / 2 - width / 2,
    VIEWPORT_MARGIN,
    vw - width - VIEWPORT_MARGIN
  )
  const cy = clamp(
    rect.top + rect.height / 2 - height / 2,
    VIEWPORT_MARGIN,
    vh - height - VIEWPORT_MARGIN
  )

  if (preferRight) {
    return { left: Math.min(rect.left + rect.width + CARD_GAP, vw - width - VIEWPORT_MARGIN), top: cy }
  }
  if (preferLeft) {
    return { left: Math.max(rect.left - width - CARD_GAP, VIEWPORT_MARGIN), top: cy }
  }
  if (preferBottom) {
    return { left: cx, top: Math.min(rect.top + rect.height + CARD_GAP, vh - height - VIEWPORT_MARGIN) }
  }
  if (preferTop) {
    return { left: cx, top: Math.max(rect.top - height - CARD_GAP, VIEWPORT_MARGIN) }
  }
  return {
    left: cx,
    top: clamp(rect.top + rect.height + CARD_GAP, VIEWPORT_MARGIN, vh - height - VIEWPORT_MARGIN),
  }
}

/** Zone lumineuse sur la cible : découpe rectangulaire dans le voile sombre. */
function Spotlight({ rect }: { rect: DOMRect }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute rounded-[10px] ring-1 ring-primary/60"
      style={{
        top: rect.top - SPOT_PAD,
        left: rect.left - SPOT_PAD,
        width: rect.width + SPOT_PAD * 2,
        height: rect.height + SPOT_PAD * 2,
        boxShadow: "0 0 0 9999px rgba(20, 28, 14, 0.45)",
        transition: "top 200ms, left 200ms, width 200ms, height 200ms",
      }}
    />
  )
}

/** Voile plein écran qui bloque les clics hors de la visite guidée. */
function TourBackdrop({ dim = false }: { dim?: boolean }) {
  return (
    <div
      aria-hidden
      onClick={(event) => event.stopPropagation()}
      className={dim ? "absolute inset-0 bg-black/35" : "absolute inset-0 bg-transparent"}
    />
  )
}

interface TourCardProps {
  index: number
  total: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  onRef: (node: HTMLDivElement | null) => void
}

/** Carte de l'étape courante : titre, texte, progression et navigation. */
function TourCard({ index, total, onNext, onPrev, onClose, onRef }: TourCardProps) {
  const step = TOUR_STEPS[index]
  if (!step) return null
  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <div
      ref={onRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      className={cn(
        "animate-rise pointer-events-auto w-[min(20rem,calc(100vw-2rem))]",
        "rounded-lg border border-border bg-background/95 p-4 shadow-[0_24px_64px_rgba(30,40,20,0.25)] backdrop-blur-md"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-muted-foreground">
          {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fermer la visite guidée"
        >
          <XIcon className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <h2 id="tour-title" className="mt-2 text-[15px] font-semibold tracking-tight text-foreground">
        {step.title}
      </h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{step.body}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onPrev} disabled={isFirst} className="gap-1">
          <ChevronLeftIcon className="h-3.5 w-3.5" aria-hidden />
          Précédent
        </Button>
        <Button type="button" size="sm" onClick={onNext} className="gap-1">
          {isLast ? "Terminer" : "Suivant"}
          {!isLast && <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />}
        </Button>
      </div>
    </div>
  )
}

/** Mesure la cible et la carte au fil des étapes (recalc au redimensionnement). */
function useTourGeometry(open: boolean, index: number) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [cardSize, setCardSize] = useState<CardSize>({ width: 320, height: 160 })
  const cardRef = useRef<HTMLDivElement | null>(null)

  const measure = useCallback(() => {
    setRect(findTargetRect(TOUR_STEPS[index]?.target))
    if (cardRef.current) {
      setCardSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
    }
  }, [index])

  const onRef = useCallback((node: HTMLDivElement | null) => {
    cardRef.current = node
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", measure)
    }
  }, [open, measure])

  return { rect, cardSize, onRef }
}

/** État de la visite : ouverture, étape courante et navigation. */
function useTourControls() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  const applyIndex = useCallback((target: number) => {
    indexRef.current = target
    setIndex(target)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    try {
      window.localStorage.setItem(DONE_KEY, "1")
    } catch {
      // stockage indisponible : on ne bloque pas la visite
    }
  }, [])

  const start = useCallback(() => {
    applyIndex(0)
    setOpen(true)
  }, [applyIndex])

  const next = useCallback(() => {
    const current = indexRef.current
    let target = current + 1
    while (
      target < TOUR_STEPS.length &&
      TOUR_STEPS[target]?.optional &&
      !findTargetRect(TOUR_STEPS[target]?.target)
    ) {
      target += 1
    }
    if (target >= TOUR_STEPS.length) {
      close()
      return
    }
    applyIndex(target)
  }, [applyIndex, close])

  const prev = useCallback(() => {
    applyIndex(Math.max(indexRef.current - 1, 0))
  }, [applyIndex])

  return { open, index, close, start, next, prev }
}

/** Écoute le bouton « Découvrir » et la touche Échap. */
function useTourEvents(start: () => void, close: () => void) {
  useEffect(() => {
    const onOpen = () => start()
    window.addEventListener(TOUR_OPEN_EVENT, onOpen)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener(TOUR_OPEN_EVENT, onOpen)
      window.removeEventListener("keydown", onKey)
    }
  }, [start, close])
}

/** Démarre automatiquement la visite à la première visite de /map. */
function useTourAutoLaunch(pathname: string, start: () => void) {
  useEffect(() => {
    if (pathname !== "/map" || tourDone()) return
    const timer = window.setTimeout(start, LAUNCH_DELAY)
    return () => clearTimeout(timer)
  }, [pathname, start])
}

interface TourPortalProps {
  index: number
  total: number
  rect: DOMRect | null
  cardSize: CardSize
  onRef: (node: HTMLDivElement | null) => void
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

/** Calque plein écran : voile sombre, centre lumineux et carte de l'étape. */
function TourPortal({
  index,
  total,
  rect,
  cardSize,
  onRef,
  onNext,
  onPrev,
  onClose,
}: TourPortalProps) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const placement =
    rect !== null ? placeCard(rect, cardSize.width, cardSize.height, vw, vh) : null

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <TourBackdrop dim={!rect} />
      {rect && <Spotlight rect={rect} />}
      {placement ? (
        <div className="absolute" style={{ top: placement.top, left: placement.left }}>
          <TourCard
            index={index}
            total={total}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            onRef={onRef}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-start justify-center pt-[22dvh]">
          <TourCard
            index={index}
            total={total}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            onRef={onRef}
          />
        </div>
      )}
    </div>,
    document.body
  )
}

/**
 * Visite guidée des nouveaux utilisateurs : voile sombre, zone lumineuse
 * sur la cible et carte d'explication. S'affiche à la première visite de
 * /map ; relançable à tout moment via <openTour/>.
 */
export function OnboardingTour() {
  const pathname = usePathname()
  const { open, index, close, start, next, prev } = useTourControls()
  const { rect, cardSize, onRef } = useTourGeometry(open, index)

  useTourEvents(start, close)
  useTourAutoLaunch(pathname, start)

  if (!open || typeof document === "undefined") return null

  return (
    <TourPortal
      index={index}
      total={TOUR_STEPS.length}
      rect={rect}
      cardSize={cardSize}
      onRef={onRef}
      onNext={next}
      onPrev={prev}
      onClose={close}
    />
  )
}