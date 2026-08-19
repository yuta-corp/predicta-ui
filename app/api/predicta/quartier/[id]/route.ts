import { NextRequest } from "next/server"
import { jsonError, proxyJson } from "@/lib/api/upstream"

export const dynamic = "force-dynamic"

// Clé primaire de la table `quartiers` : rel_<osmId> | n_<osmId> | w_<osmId>.
const QUARTIER_ID = /^(rel_|n_|w_)\d+$/

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!QUARTIER_ID.test(id)) {
    return jsonError({
      code: "invalid_request",
      message: "Identifiant de quartier invalide.",
      status: 400,
    })
  }

  return proxyJson(`/traffic/quartier/${encodeURIComponent(id)}`, {}, 20_000)
}
