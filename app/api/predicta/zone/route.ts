import { NextRequest } from "next/server"
import { isQuartierView, jsonError, proxyJson } from "@/lib/api/upstream"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError({
      code: "invalid_request",
      message: "Le corps doit être un JSON valide.",
      status: 400,
    })
  }

  if (!isQuartierView(body)) {
    return jsonError({
      code: "invalid_request",
      message: "Le corps doit contenir { name, lon, lat }.",
      status: 400,
    })
  }

  return proxyJson(
    "/traffic/zone",
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    },
    20_000
  )
}
