/**
 * Proxy serveur vers l'API Predicta upstream.
 *
 * C'est la SEULE couche qui connaît la clé API (X-API-Key) : elle n'est
 * jamais exposée au navigateur. À importer uniquement depuis les route
 * handlers (app/api/predicta/*) — jamais depuis des composants client.
 */

import { NextResponse } from "next/server"
import type { APIError, APIErrorCode, TrafficMeta } from "@/lib/types/traffic"

const UPSTREAM_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ""
const API_KEY = process.env.API_KEY ?? ""

const UPSTREAM_ERROR: Record<number, APIErrorCode> = {
  401: "unauthorized",
  404: "not_found",
  502: "upstream_error",
  503: "upstream_error",
  504: "upstream_error",
}

function jsonError(error: APIError): Response {
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

/**
 * Forwarde une requête vers l'upstream et renvoie une Response Next.js
 * avec une enveloppe uniforme `{ data, meta }` (métadonnées de fraîcheur
 * lues depuis les en-têtes X-Predicta-*).
 */
export async function proxyJson(
  path: string,
  init: RequestInit = {},
  timeoutMs = 15_000
): Promise<Response> {
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

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${UPSTREAM_BASE}${path}`, {
      ...init,
      headers: {
        "X-API-Key": API_KEY,
        // L'upstream ne sert que application/geo+json sur les endpoints
        // trafic : un Accept restrictif déclencherait un 406.
        Accept: "application/geo+json, application/json, */*",
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
      cache: "no-store",
    })

    if (!res.ok) {
      return jsonError({
        code: UPSTREAM_ERROR[res.status] ?? "upstream_error",
        message: `L'API Predicta a répondu ${res.status}.`,
        status: res.status,
      })
    }

    const text = await res.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }

    return NextResponse.json({ data, meta: readTrafficMeta(res) })
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

export { jsonError }
