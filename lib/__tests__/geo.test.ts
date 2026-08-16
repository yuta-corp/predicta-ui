import { describe, expect, it } from "vitest"
import {
  bboxOfFeature,
  bboxOfFeatures,
  featureKey,
  gridCellKey,
  haversineKm,
  nearestQuartier,
} from "@/lib/geo"
import type { TrafficFeature } from "@/lib/types/traffic"

function line(coords: [number, number][]): TrafficFeature {
  return {
    type: "Feature",
    properties: { speed: 30, rate: 0.8 },
    geometry: { type: "LineString", coordinates: coords },
  }
}

describe("gridCellKey", () => {
  it("snaps coordinates to grid cells", () => {
    expect(gridCellKey(47.524, -18.909)).toBe("4752:-1891")
    expect(gridCellKey(47.525, -18.91)).toBe("4753:-1891")
  })
})

describe("haversineKm", () => {
  it("returns 0 for identical points", () => {
    expect(haversineKm([47.524, -18.909], [47.524, -18.909])).toBe(0)
  })
  it("returns ~1.1km for 0.01° of latitude", () => {
    const d = haversineKm([47.524, -18.909], [47.524, -18.899])
    expect(d).toBeGreaterThan(1)
    expect(d).toBeLessThan(1.2)
  })
})

describe("nearestQuartier", () => {
  it("finds Analakely near its centroid", () => {
    const q = nearestQuartier(47.5269, -18.9079)
    expect(q?.name).toBe("Analakely")
  })
  it("returns null far outside the catalogue", () => {
    const q = nearestQuartier(90, 0)
    expect(q).toBeNull()
  })
})

describe("featureKey", () => {
  it("keys LineString by its coordinates", () => {
    const a = line([[1, 2], [3, 4]])
    expect(featureKey(a)).toBe(JSON.stringify([[1, 2], [3, 4]]))
  })
  it("keys MultiLineString by its first line", () => {
    const f: TrafficFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiLineString",
        coordinates: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]],
      },
    }
    expect(featureKey(f)).toBe(JSON.stringify([[1, 2], [3, 4]]))
  })
})

describe("bbox", () => {
  it("computes the bounding box of a feature", () => {
    const f = line([[1, 1], [2, 3], [-1, 2]])
    expect(bboxOfFeature(f)).toEqual({ west: -1, south: 1, east: 2, north: 3 })
  })
  it("computes the bounding box of many features", () => {
    const bbox = bboxOfFeatures([line([[1, 1]]), line([[5, 7]])])
    expect(bbox).toEqual({ west: 1, south: 1, east: 5, north: 7 })
  })
})
