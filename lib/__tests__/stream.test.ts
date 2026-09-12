import { beforeEach, describe, expect, it, vi } from "vitest"

import type { NotificationEntry } from "@/lib/notifications/events"
import type { FriendRequest } from "@/lib/types/social"

/**
 * Store factice : le vrai store persiste dans localStorage, indisponible en
 * environnement node. On vérifie ici le contrat de `applyStreamMessage`
 * (quels appels, quels événements remontés), pas la persistance.
 */
const mocks = vi.hoisted(() => {
  const state = {
    userId: null as string | null,
    requests: [] as FriendRequest[],
    recent: [] as NotificationEntry[],
  }
  return {
    state,
    setUser: (userId: string | null) => {
      state.userId = userId
      state.requests = []
      state.recent = []
    },
    applySnapshot: (requests: FriendRequest[]) => {
      state.requests = requests
    },
    applyTick: (requests: FriendRequest[], events: NotificationEntry[]) => {
      state.requests = requests
      state.recent = [...events, ...state.recent]
    },
  }
})

vi.mock("@/lib/store/notifications", () => ({
  useNotificationsStore: {
    getState: () => ({
      setUser: mocks.setUser,
      applySnapshot: mocks.applySnapshot,
      applyTick: mocks.applyTick,
    }),
  },
}))

const { applyStreamMessage, readStreamMessage } = await import(
  "@/lib/notifications/stream"
)

function request(id: string): FriendRequest {
  return {
    id,
    fromUserId: `user_${id}`,
    fromName: `Ami ${id}`,
    fromImageUrl: null,
    createdAt: new Date("2026-09-12T10:00:00Z"),
  }
}

function entry(id: string): NotificationEntry {
  return {
    id,
    kind: "sharing",
    actorId: `user_${id}`,
    createdAt: 1_700_000_000_000,
    title: `Événement ${id}`,
  }
}

describe("readStreamMessage", () => {
  it("décode un message SSE valide", () => {
    expect(readStreamMessage('{"type":"snapshot","requests":[]}')).toEqual({
      type: "snapshot",
      requests: [],
    })
  })

  it("renvoie null sur un message illisible (jamais d'exception)", () => {
    expect(readStreamMessage("pas du json")).toBeNull()
    expect(readStreamMessage("")).toBeNull()
  })
})

describe("applyStreamMessage", () => {
  beforeEach(() => {
    mocks.setUser("user_me")
  })

  it("un snapshot remplace les demandes et ne produit aucun toast", () => {
    const onEntry = vi.fn()

    applyStreamMessage({ type: "snapshot", requests: [request("r1")] }, onEntry)

    expect(mocks.state.requests.map((item) => item.id)).toEqual(["r1"])
    expect(mocks.state.recent).toEqual([])
    expect(onEntry).not.toHaveBeenCalled()
  })

  it("un tick met à jour demandes et historique, et remonte chaque événement", () => {
    const onEntry = vi.fn()

    applyStreamMessage(
      { type: "tick", requests: [request("r2")], events: [entry("e1"), entry("e2")] },
      onEntry
    )

    expect(mocks.state.requests.map((item) => item.id)).toEqual(["r2"])
    expect(mocks.state.recent.map((item) => item.id)).toEqual(["e1", "e2"])
    expect(onEntry.mock.calls.map(([value]) => value.id)).toEqual(["e1", "e2"])
  })

  it("un tick sans événement laisse l'historique intact", () => {
    applyStreamMessage({ type: "tick", requests: [], events: [] }, vi.fn())

    expect(mocks.state.recent).toEqual([])
  })
})
