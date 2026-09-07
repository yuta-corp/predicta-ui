import { describe, expect, it } from "vitest"
import { createPositionFilter, type PositionFix } from "@/lib/map/position-filter"

// Autour de Tana : 1° de latitude ≈ 111.3 km, donc ~8 m ≈ 0.000072°.
const BASE: PositionFix = {
  latitude: -18.909,
  longitude: 47.524,
  accuracy: 10,
  timestamp: 0,
}

function fix(overrides: Partial<PositionFix>): PositionFix {
  return { ...BASE, ...overrides }
}

describe("createPositionFilter", () => {
  it("commits the very first fix", () => {
    const filter = createPositionFilter()
    expect(filter.next(BASE)).toEqual(BASE)
  })

  it("holds the dot for small jitter with equal or worse accuracy", () => {
    const filter = createPositionFilter()
    filter.next(BASE)
    // ~5 m de latitude, précision identique → le point affiché ne bouge pas.
    expect(filter.next(fix({ latitude: BASE.latitude + 0.000045 }))).toBeNull()
    // Précision dégradée, même déplacement faible → toujours pas de mouvement.
    expect(
      filter.next(fix({ latitude: BASE.latitude + 0.000045, accuracy: 25 }))
    ).toBeNull()
  })

  it("moves the dot after real displacement", () => {
    const filter = createPositionFilter()
    filter.next(BASE)
    // ~20 m de latitude (> 8 m) → déplacement réel, le point suit.
    const moved = fix({ latitude: BASE.latitude + 0.00018 })
    expect(filter.next(moved)).toEqual(moved)
  })

  it("refines the dot when a fix is notably more accurate", () => {
    const filter = createPositionFilter()
    filter.next(fix({ accuracy: 50 }))
    // 3 m de distance mais 20 m de précision (≤ 50 × 0.7) → raffinement.
    const refined = fix({
      latitude: BASE.latitude + 0.000027,
      accuracy: 20,
      timestamp: 1000,
    })
    expect(filter.next(refined)).toEqual(refined)
  })

  it("eventually accepts a worse fix after the stale grace period", () => {
    const filter = createPositionFilter()
    filter.next(BASE)
    // Fix proche et moins précis, mais 25 s après le point affiché → appliqué.
    const stale = fix({
      latitude: BASE.latitude + 0.000045,
      accuracy: 30,
      timestamp: 25_000,
    })
    expect(filter.next(stale)).toEqual(stale)
  })

  it("keeps holding before the stale grace period", () => {
    const filter = createPositionFilter()
    filter.next(BASE)
    const notStaleYet = fix({
      latitude: BASE.latitude + 0.000045,
      accuracy: 30,
      timestamp: 10_000,
    })
    expect(filter.next(notStaleYet)).toBeNull()
  })

  it("reset() drops the held position", () => {
    const filter = createPositionFilter()
    filter.next(BASE)
    filter.reset()
    const fresh = fix({ latitude: BASE.latitude + 0.000045 })
    expect(filter.next(fresh)).toEqual(fresh)
  })
})