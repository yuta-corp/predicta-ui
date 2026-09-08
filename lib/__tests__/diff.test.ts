import { describe, expect, it } from "vitest"

import {
  acceptedKey,
  diffAcceptedRequests,
  diffIncomingRequests,
  diffNewSharers,
} from "@/lib/notifications/diff"
import type {
  AcceptedFriendRequest,
  FriendLocation,
  FriendRequest,
} from "@/lib/types/social"

const request = (id: string): FriendRequest => ({
  id,
  fromUserId: "user_autre",
  fromName: "Lova",
  fromImageUrl: null,
  createdAt: new Date("2026-09-02T10:00:00Z"),
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

describe("diffIncomingRequests", () => {
  it("signale toutes les demandes quand rien n'a été vu", () => {
    expect(diffIncomingRequests(new Set(), [request("a"), request("b")])).toHaveLength(2)
  })

  it("ne signale que les demandes non encore vues", () => {
    const seen = new Set(["a"])
    const diff = diffIncomingRequests(seen, [request("a"), request("b")])

    expect(diff.map((r) => r.id)).toEqual(["b"])
  })

  it("ne signale rien quand tout est déjà connu", () => {
    const seen = new Set(["a", "b"])

    expect(diffIncomingRequests(seen, [request("a"), request("b")])).toEqual([])
  })
})

describe("diffAcceptedRequests", () => {
  it("signale toutes les acceptations non vues", () => {
    const diff = diffAcceptedRequests(new Set(), [accepted("u1", "2026-09-03T10:00:00Z")])

    expect(diff.map((a) => a.friendId)).toEqual(["u1"])
  })

  it("ignore les acceptations déjà notifiées", () => {
    const seen = new Set([acceptedKey(accepted("u1", "2026-09-03T10:00:00Z"))])

    expect(diffAcceptedRequests(seen, [accepted("u1", "2026-09-03T10:00:00Z")])).toEqual([])
  })

  it("re-notifie si le même ami est re-ajouté puis re-accepté plus tard", () => {
    const first = accepted("u1", "2026-09-03T10:00:00Z")
    const second = accepted("u1", "2026-09-10T14:00:00Z")
    const seen = new Set([acceptedKey(first)])

    const diff = diffAcceptedRequests(seen, [second])

    expect(diff.map((a) => a.friendId)).toEqual(["u1"])
  })
})

describe("diffNewSharers", () => {
  it("signale un ami qui vient de commencer à partager", () => {
    const seen = new Set(["u_connue"])

    const diff = diffNewSharers(seen, [location("u_connue"), location("u_nouvelle")])

    expect(diff.map((l) => l.userId)).toEqual(["u_nouvelle"])
  })

  it("ignore les partageurs déjà connus et ceux qui ont arrêté", () => {
    const seen = new Set(["u_jean"])

    expect(diffNewSharers(seen, [])).toEqual([])
    expect(diffNewSharers(seen, [location("u_jean")])).toEqual([])
  })
})