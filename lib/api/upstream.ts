/**
 * Proxy serveur vers l'API Predicta upstream.
 *
 * C'est la SEULE couche qui connaît la clé API (X-API-Key) : elle n'est
 * jamais exposée au navigateur. À importer uniquement depuis les route
 * handlers (app/api/predicta/*) — jamais depuis des composants client.
 */

import { NextResponse } from "next/server"
import type { APIError, APIErrorCode, TrafficMeta } from "@/lib/types/traffic"

const UPSTREAM_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ""
const API_KEY = process.env.API_KEY ?? ""

const UPSTREAM_ERROR: Record<number, APIErrorCode> = {
  401: "unauthorized",
  404: "not_found",
  502: "upstream_error",
  503: "upstream_error",
  504: "upstream_error",
}

export function jsonError(error: APIError): Response {
  return NextResponse.json({ error }, { status: error.status ?? 500 })
}

function readTrafficMeta(res: Response): TrafficMeta {
  const age = res.headers.get("x-predicta-age")
  const ageMs = age !== null && /^\d+$/.test(age) ? Number(age) : null
  return {
    ageMs,
    partial: res.headers.get("x-predicta-partial") === "true",
    fallback: res.headers.get("x-predicta-fallback") === "true",
    fetchedAt: Date.now(),
  }
}

/** Erreur de configuration (URL ou clé manquante), ou null si tout est prêt. */
function configurationError(): Response | null {
  if (!UPSTREAM_BASE) {
    return jsonError({
      code: "not_configured",
      message: "L'URL de l'API Predicta n'est pas configurée (API_URL).",
      status: 500,
    })
  }
  if (!API_KEY) {
    return jsonError({
      code: "not_configured",
      message: "La clé API Predicta n'est pas configurée (API_KEY).",
      status: 500,
    })
  }
  return null
}

/** Appelle l'upstream avec la clé API et le bon Accept. */
function fetchUpstream(
  path: string,
  init: RequestInit,
  signal: AbortSignal
): Promise<Response> {
  return fetch(`${UPSTREAM_BASE}${path}`, {
    ...init,
    headers: {
      "X-API-Key": API_KEY,
      // L'upstream ne sert que application/geo+json sur les endpoints trafic :
      // un Accept restrictif déclencherait un 406.
      Accept: "application/geo+json, application/json, */*",
      ...(init.headers ?? {}),
    },
    signal,
    cache: "no-store",
  })
}

/** Corps de la réponse : JSON si possible, texte brut sinon. */
function parseBody(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Forwarde une requête vers l'upstream et renvoie une Response Next.js avec une
 * enveloppe uniforme `{ data, meta }` (fraîcheur lue depuis les en-têtes
 * X-Predicta-*).
 */
export async function proxyJson(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15_000
): Promise<Response> {
  const configFailure = configurationError()
  if (configFailure) return configFailure

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetchUpstream(path, init, controller.signal)
    if (!res.ok) {
      return jsonError({
        code: UPSTREAM_ERROR[res.status] ?? "upstream_error",
        message: `L'API Predicta a répondu ${res.status}.`,
        status: res.status,
      })
    }
    return NextResponse.json({
      data: parseBody(await res.text()),
      meta: readTrafficMeta(res),
    })
  } catch {
    if (controller.signal.aborted) {
      return jsonError({
        code: "timeout",
        message: "L'API Predicta ne répond pas à temps.",
        status: 504,
      })
    }
    return jsonError({
      code: "network",
      message: "Impossible de joindre l'API Predicta.",
      status: 502,
    })
  } finally {
    clearTimeout(timer)
  }
}

export function isQuartierView(value: unknown): value is {
  name: string
  lon: number
  lat: number
} {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === "string" &&
    typeof v.lon === "number" &&
    Number.isFinite(v.lon) &&
    typeof v.lat === "number" &&
    Number.isFinite(v.lat)
  )
}
