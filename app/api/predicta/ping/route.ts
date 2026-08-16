import { proxyJson } from "@/lib/api/upstream"

export const dynamic = "force-dynamic"

export async function GET() {
  return proxyJson("/ping", {}, 8_000)
}
