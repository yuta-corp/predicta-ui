"use client"

import { useEffect, useState } from "react"

// Écran de chargement — radar de vol × signalétique suisse.
// Reste ≥ minMs pour éviter le flash, puis fond après `done`.
export function LoadingScreen({ done, minMs = 1100 }: { done: boolean; minMs?: number }) {
  const [elapsed, setElapsed] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setElapsed(true), minMs)
    return () => clearTimeout(t)
  }, [minMs])

  const hide = done && elapsed
  useEffect(() => {
    if (!hide) return
    const t = setTimeout(() => setGone(true), 600) // durée du fondu
    return () => clearTimeout(t)
  }, [hide])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--background)] transition-opacity duration-500"
      style={{ opacity: hide ? 0 : 1 }}
      aria-hidden={hide}
    >
      {/* grille de fond discrète */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* radar : anneaux + balayage + marque P */}
        <div className="relative grid h-40 w-40 place-items-center">
          <span className="absolute h-40 w-40 rounded-full border border-[var(--color-lime)]/15" />
          <span className="absolute h-28 w-28 rounded-full border border-[var(--color-lime)]/20" />
          <span className="absolute h-40 w-40 animate-[radar-ping_2s_ease-out_infinite] rounded-full border border-[var(--color-lime)]/40" />
          <span
            className="absolute h-40 w-40 animate-[radar-sweep_2.4s_linear_infinite] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, var(--color-lime) 40deg, transparent 60deg)",
              opacity: 0.35,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="YUTA Corp"
            className="relative h-14 w-14 animate-pulse object-contain drop-shadow-[0_0_28px_var(--color-lime)]"
          />
          {/* ponytail: plain img — one asset, no next/image config for a splash logo */}
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            Predicta
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Initialisation du trafic
          </p>
          {/* barre de progression indéterminée */}
          <div className="mt-1 h-px w-40 overflow-hidden bg-[var(--foreground)]/10">
            <span className="block h-full w-1/3 animate-[load-bar_1.2s_ease-in-out_infinite] bg-[var(--color-lime)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
