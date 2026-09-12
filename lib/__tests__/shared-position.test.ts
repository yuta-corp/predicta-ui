import { describe, expect, it } from "vitest"

import {
  buildSharedPositionGeoJson,
  MAX_SHARED_ACCURACY_RADIUS_M,
} from "@/lib/map/shared-position"

const POSITION = { latitude: -18.909, longitude: 47.524, accuracy: 25 }

describe("buildSharedPositionGeoJson", () => {
  it("dessine le cercle de précision puis le point", () => {
    const collection = buildSharedPositionGeoJson(POSITION)

    expect(collection.features).toHaveLength(2)
    expect(collection.features[0].geometry.type).toBe("Polygon")
    expect(collection.features[1].geometry).toEqual({
      type: "Point",
      coordinates: [47.524, -18.909],
    })
  })

  it("n'invente pas de cercle quand la précision est inconnue", () => {
    const collection = buildSharedPositionGeoJson({ ...POSITION, accuracy: null })

    expect(collection.features).toHaveLength(1)
    expect(collection.features[0].geometry.type).toBe("Point")
  })

  it("plafonne le rayon du cercle", () => {
    const [huge] = buildSharedPositionGeoJson({
      ...POSITION,
      accuracy: 900_000,
    }).features
    const [capped] = buildSharedPositionGeoJson({
      ...POSITION,
      accuracy: MAX_SHARED_ACCURACY_RADIUS_M,
    }).features

    expect(huge.geometry).toEqual(capped.geometry)
  })

  it("refuse des coordonnées hors du monde", () => {
    expect(
      buildSharedPositionGeoJson({ latitude: 91, longitude: 47, accuracy: 10 }).features
    ).toEqual([])
    expect(
      buildSharedPositionGeoJson({ latitude: -18, longitude: 181, accuracy: 10 }).features
    ).toEqual([])
    expect(
      buildSharedPositionGeoJson({
        latitude: Number.NaN,
        longitude: 47,
        accuracy: 10,
      }).features
    ).toEqual([])
  })
})
