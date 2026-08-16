/**
 * Client API Predicta — la seule couche que le navigateur utilise.
 * Appelle les route handlers /api/predicta/* (le proxy détient la clé).
 */

import type {
  APIError,
  QuartierView,
  TrafficFeatureCollection,
  TrafficMeta,
  TrafficResponse,
} from "@/lib/types/traffic"

interface Envelope<T> {
  data: T
  meta: TrafficMeta
}

function apiError(error: APIError): APIError {
  return error
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<Envelope<T>> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    })
  } catch {
    throw apiError({
      code: "network",
      message: "Impossible de joindre Predicta. Vérifiez votre connexion.",
    })
  }

  let payload: unknown = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok) {
    const error = (payload as { error?: APIError } | null)?.error
    throw apiError(
      error ?? {
        code: "internal",
        message: `Réponse inattendue de Predicta (${res.status}).`,
        status: res.status,
      }
    )
  }

  const envelope = payload as Envelope<T> | null
  if (!envelope || !("data" in envelope)) {
    throw apiError({
      code: "internal",
      message: "Réponse Predicta invalide.",
    })
  }
  return envelope
}

/** Recherche de quartiers (q vide = tous). */
export async function fetchQuartiers(q = ""): Promise<QuartierView[]> {
  const { data } = await request<QuartierView[]>(
    `/api/predicta/quartiers?q=${encodeURIComponent(q)}`
  )
  return data
}

/** Trafic de la ville entière — usage rare. */
export async function fetchCityTraffic(): Promise<TrafficResponse> {
  const { data, meta } = await request<TrafficFeatureCollection>(
    "/api/predicta/traffic"
  )
  return { data, meta }
}

/** Trafic autour d'un centroïde (scan / exploration libre). */
export async function fetchZoneTraffic(
  view: QuartierView
): Promise<TrafficResponse> {
  const { data, meta } = await request<TrafficFeatureCollection>(
    "/api/predicta/zone",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(view),
    }
  )
  return { data, meta }
}

/** Trafic précis d'un quartier (grille polygone, caché 45 s serveur). */
export async function fetchQuartierTraffic(
  quartierId: string
): Promise<TrafficResponse> {
  const { data, meta } = await request<TrafficFeatureCollection>(
    `/api/predicta/quartier/${encodeURIComponent(quartierId)}`
  )
  return { data, meta }
}
