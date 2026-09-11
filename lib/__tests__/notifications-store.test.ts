import { describe, expect, it } from "vitest"

import type { NotificationEntry } from "@/lib/notifications/events"
import {
  MAX_RECENT_NOTIFICATIONS,
  mergeRecentNotifications,
  sanitizeRecentNotifications,
} from "@/lib/store/notifications"

function entry(id: string, createdAt = 1): NotificationEntry {
  return {
    id,
    kind: "sharing",
    actorId: `user_${id}`,
    createdAt,
    title: `Événement ${id}`,
  }
}

describe("mergeRecentNotifications", () => {
  it("place les nouveaux événements en tête", () => {
    const merged = mergeRecentNotifications([entry("a")], [entry("b")])

    expect(merged.map((item) => item.id)).toEqual(["b", "a"])
  })

  it("ne conserve que les 10 entrées les plus récentes", () => {
    const existing = Array.from({ length: MAX_RECENT_NOTIFICATIONS }, (_, i) =>
      entry(`ancien-${i}`)
    )
    const merged = mergeRecentNotifications(existing, [entry("nouveau")])

    expect(merged).toHaveLength(MAX_RECENT_NOTIFICATIONS)
    expect(merged[0].id).toBe("nouveau")
    expect(merged.map((item) => item.id)).not.toContain(
      `ancien-${MAX_RECENT_NOTIFICATIONS - 1}`
    )
  })

  it("dédoublonne un événement rejoué et remonte sa version à jour", () => {
    const merged = mergeRecentNotifications(
      [entry("a", 100), entry("sharing:u1", 200)],
      [entry("sharing:u1", 900)]
    )

    expect(merged.map((item) => item.id)).toEqual(["sharing:u1", "a"])
    expect(merged[0].createdAt).toBe(900)
  })

  it("tronque un lot entrant plus grand que la limite", () => {
    const incoming = Array.from({ length: MAX_RECENT_NOTIFICATIONS + 5 }, (_, i) =>
      entry(`e${i}`)
    )

    expect(mergeRecentNotifications([], incoming)).toHaveLength(
      MAX_RECENT_NOTIFICATIONS
    )
  })

  it("reste vide sans entrée", () => {
    expect(mergeRecentNotifications([], [])).toEqual([])
  })
})

describe("sanitizeRecentNotifications", () => {
  it("rejette tout ce qui n'est pas une liste", () => {
    expect(sanitizeRecentNotifications(null)).toEqual([])
    expect(sanitizeRecentNotifications("nope")).toEqual([])
    expect(sanitizeRecentNotifications({ recent: [] })).toEqual([])
  })

  it("écarte les entrées mal formées d'un stockage local non fiable", () => {
    const sanitized = sanitizeRecentNotifications([
      entry("ok"),
      { id: "sans-kind", createdAt: 1, title: "x", actorId: "y" },
      { id: "kind-inconnu", kind: "pirate", createdAt: 1, title: "x", actorId: "y" },
      { id: "sans-date", kind: "sharing", createdAt: "hier", title: "x", actorId: "y" },
      null,
    ])

    expect(sanitized.map((item) => item.id)).toEqual(["ok"])
  })

  it("plafonne même un historique trop long", () => {
    const tooMany = Array.from({ length: 40 }, (_, i) => entry(`e${i}`))

    expect(sanitizeRecentNotifications(tooMany)).toHaveLength(
      MAX_RECENT_NOTIFICATIONS
    )
  })
})
