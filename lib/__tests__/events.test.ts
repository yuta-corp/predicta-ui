import { describe, expect, it } from "vitest"

import {
  acceptedEntry,
  requestEntry,
  sharingEntry,
  sharingEntryFromLocation,
} from "@/lib/notifications/events"
import type { FriendLocation } from "@/lib/types/social"

const at = (iso: string) => new Date(iso)

describe("requestEntry", () => {
  it("construit une entrée de demande d'amis reçue, ciblée sur le demandeur", () => {
    expect(
      requestEntry({
        requestId: "a",
        fromUserId: "user_lova",
        fromName: "Lova",
        createdAt: at("2026-09-02T10:00:00Z"),
      })
    ).toEqual({
      id: "request:a",
      kind: "request",
      actorId: "user_lova",
      createdAt: at("2026-09-02T10:00:00Z").getTime(),
      title: "Lova vous a envoyé une demande d'ami.",
    })
  })

  it("porte l'horodatage de la demande, pour l'ancienneté affichée", () => {
    const entry = requestEntry({
      requestId: "a",
      fromUserId: "u1",
      fromName: "Lova",
      createdAt: at("2026-09-02T10:00:00Z"),
    })

    expect(entry.createdAt).toBe(at("2026-09-02T10:00:00Z").getTime())
  })
})

describe("acceptedEntry", () => {
  it("construit une entrée d'acceptation, unique par ami et date", () => {
    const first = acceptedEntry({
      friendId: "u1",
      friendName: "Jean",
      acceptedAt: at("2026-09-03T10:00:00Z"),
    })
    const second = acceptedEntry({
      friendId: "u1",
      friendName: "Jean",
      acceptedAt: at("2026-09-10T14:00:00Z"),
    })

    expect(first.id).not.toBe(second.id)
    expect(second).toEqual({
      id: `accepted:u1:${at("2026-09-10T14:00:00Z").getTime()}`,
      kind: "accepted",
      actorId: "u1",
      createdAt: at("2026-09-10T14:00:00Z").getTime(),
      title: "Jean a accepté votre demande.",
    })
  })
})

describe("sharingEntry", () => {
  it("construit une entrée de partage de position, ciblée sur le partageur", () => {
    expect(
      sharingEntry({
        userId: "u1",
        name: "Jean",
        startedAt: at("2026-09-02T10:00:00Z"),
      })
    ).toEqual({
      id: "sharing:u1",
      kind: "sharing",
      actorId: "u1",
      createdAt: at("2026-09-02T10:00:00Z").getTime(),
      title: "Jean a commencé à partager sa position.",
    })
  })

  it("dérive la même entrée depuis une position d'ami", () => {
    const location: FriendLocation = {
      userId: "u1",
      name: "Jean",
      imageUrl: null,
      latitude: -18.9,
      longitude: 47.5,
      accuracy: 10,
      updatedAt: at("2026-09-02T10:00:00Z"),
    }

    expect(sharingEntryFromLocation(location)).toEqual(
      sharingEntry({
        userId: "u1",
        name: "Jean",
        startedAt: location.updatedAt,
      })
    )
  })
})
