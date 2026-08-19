import { proxyJson } from "@/lib/api/upstream"

export const dynamic = "force-dynamic"

// Ville entière (13 tuiles) : plus lourd, réservé aux usages rares
// (moment héro de la landing, action explicite).
export async function GET() {
  return proxyJson("/traffic", {}, 30_000)
}
