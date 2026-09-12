"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { fetchQuartiers, fetchQuartierTraffic } from "@/lib/api/client"
import { formatRelativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"

interface Check {
  name: string
  status: "ok" | "degraded" | "error"
  detail: string
  latencyMs?: number
}

const ANALAKELY_ID = "n_574547485"
const REFRESH_MS = 30_000
const TICK_MS = 1_000

const STATUS_LABEL: Record<Check["status"], string> = {
  ok: "Opérationnel",
  degraded: "Dégradé",
  error: "Indisponible",
}

const STATUS_CLASS: Record<Check["status"], string> = {
  ok: "text-primary",
  degraded: "text-[#e0b25c]",
  error: "text-[#e08a70]",
}

/** Vérifie le ping, le catalogue de quartiers puis un trafic réel. */
async function runChecks(): Promise<Check[]> {
  const checks: Check[] = []

  try {
    const started = performance.now()
    const res = await fetch("/api/predicta/ping")
    checks.push({
      name: "Health",
      status: res.ok ? "ok" : "error",
      detail: res.ok ? "API accessible" : `HTTP ${res.status}`,
      latencyMs: Math.round(performance.now() - started),
    })
  } catch {
    checks.push({ name: "Health", status: "error", detail: "Injoignable" })
  }

  try {
    const started = performance.now()
    const quartiers = await fetchQuartiers("")
    checks.push({
      name: "Quartier API",
      status: "ok",
      detail: `${quartiers.length} quartiers indexés`,
      latencyMs: Math.round(performance.now() - started),
    })
  } catch {
    checks.push({ name: "Quartier API", status: "error", detail: "Indisponible" })
  }

  try {
    const started = performance.now()
    const { data, meta } = await fetchQuartierTraffic(ANALAKELY_ID)
    const freshness =
      meta.ageMs !== null ? `cache ${(meta.ageMs / 1000).toFixed(0)} s` : "live"
    checks.push({
      name: "Traffic API",
      status: meta.partial || meta.fallback ? "degraded" : "ok",
      detail: `${data.features.length} routes · ${freshness}${meta.partial ? " · partiel" : ""}${meta.fallback ? " · repli" : ""}`,
      latencyMs: Math.round(performance.now() - started),
    })
  } catch {
    checks.push({ name: "Traffic API", status: "error", detail: "Indisponible" })
  }

  return checks
}

/** Vérifications périodiques, avec horloge pour l'ancienneté affichée. */
function useStatusChecks() {
  const [checks, setChecks] = useState<Check[] | null>(null)
  const [lastChecked, setLastChecked] = useState(0)
  const [now, setNow] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const refresh = () => {
      runChecks()
        .then((result) => {
          if (cancelled) return
          setChecks(result)
          setLastChecked(Date.now())
          setError(null)
        })
        .catch(() => {
          if (!cancelled) setError("Vérification impossible.")
        })
    }
    refresh()
    const id = setInterval(refresh, REFRESH_MS)
    const tick = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => {
      cancelled = true
      clearInterval(id)
      clearInterval(tick)
    }
  }, [])

  return { checks, lastChecked, now, error }
}

/** Une ligne de vérification : nom, détail, latence, état. */
function StatusRow({ check }: { check: Check }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-4">
      <div>
        <p className="text-[14px] font-medium">{check.name}</p>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{check.detail}</p>
      </div>
      <div className="flex shrink-0 items-baseline gap-3">
        {check.latencyMs !== undefined && (
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {check.latencyMs} ms
          </span>
        )}
        <span className={cn("text-[13px] font-medium", STATUS_CLASS[check.status])}>
          {STATUS_LABEL[check.status]}
        </span>
      </div>
    </div>
  )
}

export default function StatusPage() {
  const { checks, lastChecked, now, error } = useStatusChecks()
  const allOk = checks !== null && checks.every((check) => check.status === "ok")
  const title =
    checks === null
      ? "Vérification…"
      : allOk
        ? "Tous les systèmes opérationnels"
        : "Certains services sont dégradés"

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
          Predicta API
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-[13.5px] text-muted-foreground">
          Dernière vérification {formatRelativeTime(Math.max(0, now - lastChecked))} ·
          mise à jour automatique toutes les 30 secondes.
        </p>

        {error && <p className="mt-4 text-[13px] text-destructive">{error}</p>}

        <div className="mt-10 space-y-0 border-t border-border">
          {(checks ?? []).map((check) => (
            <StatusRow key={check.name} check={check} />
          ))}
        </div>

        <p className="mt-10 text-[12.5px] leading-relaxed text-muted-foreground">
          Cette page reflète l&apos;état réel de l&apos;API Predicta : chaque ligne
          est un appel de vérification vers l&apos;upstream. Aucune donnée n&apos;est
          simulée.
        </p>
        <Link
          href="/map"
          className="mt-6 inline-block text-[13.5px] text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
        >
          Retour à la carte
        </Link>
      </div>
    </main>
  )
}
