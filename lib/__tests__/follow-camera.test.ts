import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Map as MapLibreMap } from "maplibre-gl"

import { createCameraFollower, RECENTER_PAUSE_MS } from "@/lib/map/follow-camera"

const POSITION = { latitude: -18.9, longitude: 47.5, accuracy: 20 }

function fakeMap() {
  const jumpTo = vi.fn()
  const flyTo = vi.fn()
  const easeTo = vi.fn()
  const map = { jumpTo, flyTo, easeTo } as unknown as MapLibreMap
  return { map, jumpTo, flyTo, easeTo }
}

function stubReducedMotion(reduced: boolean): void {
  vi.stubGlobal("window", { matchMedia: () => ({ matches: reduced }) })
}

describe("createCameraFollower", () => {
  beforeEach(() => {
    stubReducedMotion(false)
    vi.spyOn(Date, "now").mockReturnValue(1_000_000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("vole vers le premier fix, avec un zoom adapté à la précision", () => {
    const { map, flyTo } = fakeMap()

    createCameraFollower().followIfNeeded(map, POSITION)

    expect(flyTo).toHaveBeenCalledTimes(1)
    expect(flyTo.mock.calls[0][0]).toMatchObject({
      center: [47.5, -18.9],
      zoom: 15,
    })
  })

  it("dézoome moins quand la précision est médiocre", () => {
    const { map, flyTo } = fakeMap()

    createCameraFollower().followIfNeeded(map, { ...POSITION, accuracy: 800 })

    expect(flyTo.mock.calls[0][0]).toMatchObject({ zoom: 13 })
  })

  it("ne bouge pas pour un déplacement sous le seuil", () => {
    const { map, flyTo, easeTo } = fakeMap()
    const follower = createCameraFollower()

    follower.followIfNeeded(map, POSITION)
    follower.followIfNeeded(map, { ...POSITION, latitude: -18.90005 })

    expect(flyTo).toHaveBeenCalledTimes(1)
    expect(easeTo).not.toHaveBeenCalled()
  })

  it("recentre en douceur après un déplacement significatif", () => {
    const { map, easeTo } = fakeMap()
    const follower = createCameraFollower()

    follower.followIfNeeded(map, POSITION)
    follower.followIfNeeded(map, { ...POSITION, latitude: -18.95 })

    expect(easeTo).toHaveBeenCalledTimes(1)
    expect(easeTo.mock.calls[0][0]).toMatchObject({ center: [47.5, -18.95] })
  })

  it("suspend le recentrage pendant que l'utilisateur explore, puis le reprend", () => {
    const { map, flyTo, easeTo } = fakeMap()
    const follower = createCameraFollower()

    follower.markInteraction()
    follower.followIfNeeded(map, POSITION)
    expect(flyTo).not.toHaveBeenCalled()
    expect(easeTo).not.toHaveBeenCalled()

    vi.spyOn(Date, "now").mockReturnValue(1_000_000 + RECENTER_PAUSE_MS + 1)
    follower.followIfNeeded(map, { ...POSITION, latitude: -18.95 })

    expect(easeTo).toHaveBeenCalledTimes(1)
  })

  it("saute instantanément en position quand les animations sont réduites", () => {
    stubReducedMotion(true)
    const { map, jumpTo, flyTo } = fakeMap()

    createCameraFollower().followIfNeeded(map, POSITION)

    expect(jumpTo).toHaveBeenCalledTimes(1)
    expect(flyTo).not.toHaveBeenCalled()
  })
})
