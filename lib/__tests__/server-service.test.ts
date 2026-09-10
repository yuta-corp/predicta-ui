import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/prisma", () => ({ prisma: {} }))

import { buildEvents } from "@/lib/notifications/server-service"
import type {
  AcceptedFriendRequest,
  FriendLocation,
  FriendRequest,
} from "@/lib/types/social"

const request = (id: string, createdAt: string): FriendRequest => ({
  id,
  fromUserId: "user_autre",
  fromName: "Lova",
  fromImageUrl: null,
  createdAt: new Date(createdAt),
})

const accepted = (friendId: string, at: string): AcceptedFriendRequest => ({
  id: `fs_${friendId}`,
  friendId,
  friendName: "Jean",
  friendImageUrl: null,
  acceptedAt: new Date(at),
})

const location = (userId: string): FriendLocation => ({
  userId,
  name: "Jean",
  imageUrl: null,
  latitude: -18.9,
  longitude: 47.5,
  accuracy: 10,
  updatedAt: new Date("2026-09-02T10:00:00Z"),
})

describe("buildEvents", () => {
  const since = new Date("2026-09-01T00:00:00Z").getTime()

  it("notifie uniquement les demandes reçues après le curseur", () => {
    const events = buildEvents(
      [request("a", "2026-08-31T00:00:00Z"), request("b", "2026-09-02T00:00:00Z")],
      [],
      [],
      since
    )

    expect(events.map((e) => e.id)).toEqual(["request:b"])
  })

  it("notifie uniquement les acceptations postérieures au curseur", () => {
    const events = buildEvents(
      [],
      [accepted("u1", "2026-08-31T00:00:00Z"), accepted("u2", "2026-09-02T00:00:00Z")],
      [],
      since
    )

    expect(events.map((e) => e.id)).toEqual(["accepted:u2:1788307200000"])
  })

  it("notifie tout nouvel ami qui partage (le partageur vient d'être détecté serveur)", () => {
    const events = buildEvents([], [], [location("u3")], since)

    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ kind: "sharing", id: "sharing:u3" })
  })

  it("tri demande, acceptation et partage dans un ordre stable", () => {
    const events = buildEvents(
      [request("a", "2026-09-02T00:00:00Z")],
      [accepted("u1", "2026-09-02T00:00:00Z")],
      [location("u2")],
      since
    )

    expect(events.map((e) => e.kind)).toEqual(["request", "accepted", "sharing"])
  })
})