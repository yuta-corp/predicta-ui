import { describe, expect, it } from "vitest"

import {
  acceptedEntry,
  requestEntry,
  sharingEntry,
} from "@/lib/notifications/events"
import type {
  AcceptedFriendRequest,
  FriendLocation,
  FriendRequest,
} from "@/lib/types/social"

const request = (id: string, createdAt = "2026-09-02T10:00:00Z"): FriendRequest => ({
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

describe("requestEntry", () => {
  it("construit une entrée de demande d'amis reçue", () => {
    expect(requestEntry(request("a"))).toEqual({
      id: "request:a",
      kind: "request",
      title: "Lova vous a envoyé une demande d'ami.",
    })
  })
})

describe("acceptedEntry", () => {
  it("construit une entrée d'acceptation, unique par ami et date", () => {
    const first = acceptedEntry(accepted("u1", "2026-09-03T10:00:00Z"))
    const second = acceptedEntry(
      accepted("u1", "2026-09-10T14:00:00Z")
    )

    expect(first.id).not.toBe(second.id)
    expect(second).toMatchObject({
      kind: "accepted",
      title: "Jean a accepté votre demande.",
    })
  })
})

describe("sharingEntry", () => {
  it("construit une entrée de partage de position", () => {
    expect(sharingEntry(location("u1"))).toEqual({
      id: "sharing:u1",
      kind: "sharing",
      title: "Jean a commencé à partager sa position.",
    })
  })
})