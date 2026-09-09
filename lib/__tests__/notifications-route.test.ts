import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, listPendingRequests, listAcceptedSince, listNewSharersSince } = vi.hoisted(
  () => ({
    authMock: vi.fn(),
    listPendingRequests: vi.fn(),
    listAcceptedSince: vi.fn(),
    listNewSharersSince: vi.fn(),
  })
)

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
}))

vi.mock("@/lib/notifications/server-service", () => ({
  listPendingRequests: () => listPendingRequests(),
  listAcceptedSince: () => listAcceptedSince(),
  listNewSharersSince: () => listNewSharersSince(),
  buildEvents: () => [],
}))

import type { NextRequest } from "next/server"

import { GET, sseComment, sseFrame } from "@/app/api/notifications/route"

const decode = (bytes?: Uint8Array) => new TextDecoder().decode(bytes)

/** Emule NextRequest : un Request natif + la propriété nextUrl utilisée par la route. */
function nextRequest(url: string, init?: RequestInit): NextRequest {
  const req = new Request(url, init)
  Object.assign(req, { nextUrl: new URL(url) })
  return req as NextRequest
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-09-09T12:00:00Z"))
  listPendingRequests.mockResolvedValue([])
  listAcceptedSince.mockResolvedValue([])
  listNewSharersSince.mockResolvedValue([])
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe("sseFrame", () => {
  it("encode un message SSE valide (id + data + double aérer)", () => {
    expect(sseFrame(123, { type: "snapshot", requests: [] })).toBe(
      'id: 123\ndata: {"type":"snapshot","requests":[]}\n\n'
    )
  })

  it("encode un commentaire keep-alive", () => {
    expect(sseComment("ping 1780")).toBe(": ping 1780\n\n")
  })
})

describe("GET /api/notifications", () => {
  it("rejette sans session (401)", async () => {
    authMock.mockResolvedValue({ userId: null })

    const res = await GET(nextRequest("http://localhost/api/notifications"))

    expect(res.status).toBe(401)
  })

  it("émet un snapshot sans curseur : id = maintenant, aucune rétroaction", async () => {
    const request = nextRequest("http://localhost/api/notifications")
    authMock.mockResolvedValue({ userId: "user_me" })
    listPendingRequests.mockResolvedValue([
      { id: "fs_1", fromUserId: "u1", fromName: "Lova", fromImageUrl: null, createdAt: new Date("2026-09-09T10:00:00Z") },
    ])

    const res = await GET(request)
    const reader = res.body!.getReader()
    const { value } = await reader.read()

    const now = new Date("2026-09-09T12:00:00Z").getTime()
    expect(decode(value)).toBe(`id: ${now}\ndata: {"type":"snapshot","requests":[{"id":"fs_1","fromUserId":"u1","fromName":"Lova","fromImageUrl":null,"createdAt":"2026-09-09T10:00:00.000Z"}]}\n\n`)
  })

  it("reprend au curseur Last-Event-ID sur reconnexion", async () => {
    const request = nextRequest("http://localhost/api/notifications", {
      headers: { "Last-Event-ID": "1770000000000" },
    })
    authMock.mockResolvedValue({ userId: "user_me" })

    const res = await GET(request)
    const reader = res.body!.getReader()
    const { value } = await reader.read()

    expect(decode(value)).toContain("id: 1770000000000")
  })

  it("envoie un keep-alive après 20 s de silence", async () => {
    const request = nextRequest("http://localhost/api/notifications")
    authMock.mockResolvedValue({ userId: "user_me" })

    const res = await GET(request)
    const reader = res.body!.getReader()
    await reader.read() // snapshot

    await vi.advanceTimersByTimeAsync(24_000)

    const { value } = await reader.read()
    const pingAt = new Date("2026-09-09T12:00:24.000Z").getTime()
    expect(decode(value)).toBe(`: ping ${pingAt}\n\n`)
  })

  it("se ferme proprement quand le signal est annulé", async () => {
    const controller = new AbortController()
    const request = nextRequest("http://localhost/api/notifications", {
      signal: controller.signal,
    })
    authMock.mockResolvedValue({ userId: "user_me" })

    const res = await GET(request)
    const reader = res.body!.getReader()
    await reader.read() // snapshot

    controller.abort()

    const { done } = await reader.read()
    expect(done).toBe(true)
  })
})