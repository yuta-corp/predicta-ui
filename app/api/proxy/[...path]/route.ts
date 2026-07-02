import { NextRequest } from "next/server"

const ALLOWED = new Set(["traffic", "quartiers"])

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  if (path.length !== 1 || !ALLOWED.has(path[0])) {
    return Response.json({ error: "not found" }, { status: 404 })
  }

  const base = process.env.NEXT_PUBLIC_API_URL
  const key = process.env.API_KEY
  if (!base || !key) {
    return Response.json({ error: "server misconfigured" }, { status: 500 })
  }

  const url = new URL(`${base}/${path.join("/")}`)
  url.search = req.nextUrl.search

  try {
    const upstream = await fetch(url, {
      headers: { "X-API-Key": key, accept: "application/geo+json, application/json" },
      cache: "no-store",
    })

    if (!upstream.ok) {
      return Response.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 },
      )
    }

    const body = await upstream.text()
    const res = new Response(body, {
      status: 200,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    })
    const partial = upstream.headers.get("X-Predicta-Partial")
    if (partial) res.headers.set("X-Predicta-Partial", partial)
    return res
  } catch {
    return Response.json({ error: "upstream unreachable" }, { status: 502 })
  }
}
