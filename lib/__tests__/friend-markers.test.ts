import { describe, expect, it } from "vitest"

import {
  buildFriendAccuracyGeoJson,
  FRIEND_STALE_AFTER_MS,
  friendFreshnessLabel,
  isStaleFriendLocation,
  MAX_ACCURACY_RADIUS_M,
  MAX_FRIENDS_ON_MAP,
  type FriendMarkerInput,
} from "@/lib/map/friend-markers"

const NOW = new Date("2026-09-11T12:00:00Z").getTime()

function friend(overrides: Partial<FriendMarkerInput> = {}): FriendMarkerInput {
  return {
    userId: "user_jean",
    name: "Jean",
    imageUrl: null,
    latitude: -18.909,
    longitude: 47.524,
    accuracy: 20,
    updatedAt: new Date(NOW - 10_000),
    ...overrides,
  }
}

describe("buildFriendAccuracyGeoJson", () => {
  it("construit un polygone par ami dont la précision est connue", () => {
    const collection = buildFriendAccuracyGeoJson([
      friend(),
      friend({ userId: "user_lova", accuracy: 40 }),
    ])

    expect(collection.features).toHaveLength(2)
    expect(collection.features[0].geometry.type).toBe("Polygon")
    expect(collection.features[0].properties).toEqual({ userId: "user_jean" })
    expect(collection.features[1].properties).toEqual({ userId: "user_lova" })
  })

  it("n'invente pas de cercle sans précision connue", () => {
    const collection = buildFriendAccuracyGeoJson([
      friend({ accuracy: null }),
      friend({ userId: "u2", accuracy: 0 }),
      friend({ userId: "u3", accuracy: Number.NaN }),
    ])

    expect(collection.features).toEqual([])
  })

  it("plafonne le rayon pour ne pas remplir la carte", () => {
    const [huge] = buildFriendAccuracyGeoJson([friend({ accuracy: 500_000 })]).features
    const [capped] = buildFriendAccuracyGeoJson([
      friend({ accuracy: MAX_ACCURACY_RADIUS_M }),
    ]).features

    expect(huge.geometry).toEqual(capped.geometry)
  })

  it("borne le nombre d'amis dessinés", () => {
    const many = Array.from({ length: MAX_FRIENDS_ON_MAP + 25 }, (_, index) =>
      friend({ userId: `u${index}` })
    )

    expect(buildFriendAccuracyGeoJson(many).features).toHaveLength(MAX_FRIENDS_ON_MAP)
  })

  it("renvoie une collection vide sans ami", () => {
    expect(buildFriendAccuracyGeoJson([]).features).toEqual([])
  })
})

describe("fraîcheur d'une position d'ami", () => {
  it("signale une position vieillissante au-delà du seuil", () => {
    const fresh = new Date(NOW - FRIEND_STALE_AFTER_MS + 1_000)
    const stale = new Date(NOW - FRIEND_STALE_AFTER_MS - 1_000)

    expect(isStaleFriendLocation(fresh, NOW)).toBe(false)
    expect(isStaleFriendLocation(stale, NOW)).toBe(true)
  })

  it("formate l'ancienneté pour la popup", () => {
    expect(friendFreshnessLabel(new Date(NOW - 1_000), NOW)).toBe(
      "mis à jour à l'instant"
    )
    expect(friendFreshnessLabel(new Date(NOW - 12_000), NOW)).toBe(
      "mis à jour il y a 12 s"
    )
    expect(friendFreshnessLabel(new Date(NOW - 120_000), NOW)).toBe(
      "mis à jour il y a 2 min"
    )
  })

  it("ne descend jamais sous zéro si l'horloge dérive", () => {
    expect(friendFreshnessLabel(new Date(NOW + 30_000), NOW)).toBe(
      "mis à jour à l'instant"
    )
  })
})
