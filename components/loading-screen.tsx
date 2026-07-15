"use client"

import { useEffect, useRef, useState } from "react"

// Écran de chargement — instrument de trafic éditorial × control-room (réf. Terminal Industries).
// Le loader ne se lève QUE quand /traffic est peint à 100% (prop `done`) : la carte visible
// derrière porte déjà ses lignes. `minMs` évite le flash sur connexion rapide.
//
// Composition : réseau de veines vives qui se dessinent (le trafic, en abstraction), radar de
// balayage, coordonnées Tana, odomètre héros. Tout en CSS/SVG, un seul accent lime.

const PHASES: [number, string][] = [
  [0, "Connexion source tuiles MVT"],
  [30, "Décodage vecteurs · z13"],
  [58, "Analyse congestion Antananarivo"],
  [82, "Rendu du réseau"],
  [99, "Réseau en direct"],
]

// Antananarivo, pour l'affichage instrument.
const COORD = "18°55′S · 47°31′E"

// ponytail: maxMs = garde-fou. Si `map.on("load")` traîne ou ne se déclenche jamais (WebGL lent
// ou absent), le loader se lève quand même — jamais de blocage infini.
export function LoadingScreen({
  done,
  minMs = 1400,
  maxMs = 12000,
}: {
  done: boolean
  minMs?: number
  maxMs?: number
}) {
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setElapsed(true), minMs)
    const cap = setTimeout(() => setTimedOut(true), maxMs)
    return () => {
      clearTimeout(t)
      clearTimeout(cap)
    }
  }, [minMs, maxMs])

  // Progression honnête : glisse vers 92% tant que /traffic n'est pas prêt, snap à 100% une fois `done`.
  // ponytail: fetch simple sans events de download → easing vers plafond, pattern standard.
  const settled = done || timedOut
  const settledRef = useRef(settled)
  settledRef.current = settled
  useEffect(() => {
    let raf = 0
    const tick = () => {
      setProgress((p) => {
        const target = settledRef.current ? 100 : 92
        const next = p + (target - p) * 0.04
        return next > 99.6 ? 100 : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pct = Math.min(100, Math.round(progress))
  const hide = settled && elapsed && pct >= 100
  const phase = PHASES.reduce((acc, [t, label]) => (pct >= t ? label : acc), PHASES[0][1])

  useEffect(() => {
    if (!hide) return
    const t = setTimeout(() => setGone(true), 900) // durée du fondu
    return () => clearTimeout(t)
  }, [hide])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[var(--background)] transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        opacity: hide ? 0 : 1,
        transform: hide ? "scale(1.06)" : "scale(1)",
        filter: hide ? "blur(10px)" : "blur(0)",
      }}
      aria-hidden={hide}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Chargement du trafic en direct"
    >
      <VeinField progress={pct} />

      {/* grille de fond, masquée en vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(130% 100% at 50% 50%, #000 25%, transparent 78%)",
        }}
      />
      {/* grain film */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-size:180px_180px]"
        style={{ backgroundImage: "var(--grain)" }}
      />
      {/* balayage radar vertical */}
      <div className="loader-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-lime)] to-transparent opacity-40" />
      {/* halo lime respirant, sous le contenu */}
      <div className="loader-breathe pointer-events-none absolute left-1/2 top-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-lime)] opacity-[0.07] blur-[80px]" />

      {/* HUD instrument — coins fins, coordonnées, statut */}
      <div className="pointer-events-none absolute inset-5 hidden sm:block">
        <Tick className="left-0 top-0 border-l border-t" />
        <Tick className="right-0 top-0 border-r border-t" />
        <Tick className="bottom-0 left-0 border-b border-l" />
        <Tick className="bottom-0 right-0 border-b border-r" />
        <p className="absolute left-0 top-0 pl-4 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Predicta / trafic
        </p>
        <p className="absolute right-0 top-0 pr-4 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {COORD}
        </p>
        <p className="absolute bottom-0 left-0 pb-3 pl-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Antananarivo · EAT
        </p>
        <p className="absolute bottom-0 right-0 pb-3 pr-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground tabular-nums">
          z13 / MVT
        </p>
      </div>

      {/* centre : marque + odomètre + barre + phase */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-8 px-8">
          <div className="flex animate-[rise_0.8s_ease-out_both] items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--color-lime)] text-[13px] font-bold text-[var(--color-ink)] shadow-[0_0_28px_-4px_var(--color-lime)]">
              P
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              Predicta
            </span>
          </div>

          <div className="flex animate-[rise_0.8s_0.1s_ease-out_both] items-start font-display text-[7rem] font-semibold leading-[0.85] text-foreground">
            <Odometer value={pct} />
            <span className="mt-3 ml-1.5 text-3xl font-normal text-[var(--color-lime)]">%</span>
          </div>

          <div className="h-px w-[min(72vw,300px)] animate-[rise_0.8s_0.2s_ease-out_both] overflow-hidden bg-[var(--foreground)]/12">
            <span
              className="block h-full bg-[var(--color-lime)] shadow-[0_0_14px_0_var(--color-lime)] transition-[width] duration-200 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="h-3 animate-[rise_0.8s_0.3s_ease-out_both] font-mono text-[10px] uppercase tracking-[0.36em] text-muted-foreground">
            {phase}
          </p>
        </div>
      </div>
    </div>
  )
}

function Tick({ className }: { className: string }) {
  return <span className={`absolute h-5 w-5 border-[var(--color-lime)]/45 ${className}`} />
}

// Réseau de veines : lignes SVG qui se "tracent" (stroke-dashoffset piloté par la progression),
// abstraction du trafic qui apparaît. Déterministe (seed fixe) pour un rendu stable.
function VeinField({ progress }: { progress: number }) {
  const paths = useRef(buildPaths()).current
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="veinFade" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--color-lime)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {paths.map((d, i) => {
        // chaque veine se révèle sur une tranche de progression → dessin séquentiel.
        const start = (i / paths.length) * 80
        const local = Math.max(0, Math.min(1, (progress - start) / 22))
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#veinFade)"
            strokeWidth={0.35}
            strokeLinecap="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1 - local,
              opacity: 0.25 + local * 0.55,
              transition: "stroke-dashoffset 0.3s linear, opacity 0.3s linear",
            }}
          />
        )
      })}
    </svg>
  )
}

// Génère des veines rayonnant du centre, cassées en segments (allure réseau routier).
function buildPaths(): string[] {
  const cx = 50
  const cy = 50
  const rng = mulberry32(0x9fca69)
  const out: string[] = []
  const spokes = 14
  for (let s = 0; s < spokes; s++) {
    const baseAngle = (s / spokes) * Math.PI * 2 + rng() * 0.3
    let x = cx
    let y = cy
    let angle = baseAngle
    let d = `M ${x.toFixed(2)} ${y.toFixed(2)}`
    const segs = 4 + Math.floor(rng() * 3)
    for (let k = 0; k < segs; k++) {
      angle += (rng() - 0.5) * 0.9
      const len = 8 + rng() * 12
      x += Math.cos(angle) * len
      y += Math.sin(angle) * len
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
    }
    out.push(d)
  }
  return out
}

// PRNG déterministe (seed fixe) — même réseau à chaque chargement, pas de hydration mismatch.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Odomètre : colonnes de chiffres 0-9 translatées ; chiffre courant cadré dans une fenêtre 1em.
function Odometer({ value }: { value: number }) {
  const digits = String(value).padStart(2, "0").split("")
  return (
    <div className="flex tabular-nums">
      {digits.map((d, i) => (
        <DigitColumn key={i} digit={Number(d)} />
      ))}
    </div>
  )
}

function DigitColumn({ digit }: { digit: number }) {
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden">
      <div
        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateY(${-digit * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <div key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </div>
        ))}
      </div>
    </div>
  )
}
