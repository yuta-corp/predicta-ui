import { NextRequest } from "next/server"
import { proxyJson } from "@/lib/api/upstream"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? ""
  return proxyJson(`/quartiers?q=${encodeURIComponent(q)}`, {}, 10_000)
}
