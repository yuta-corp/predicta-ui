import { describe, expect, it } from "vitest"

import { isUsableFix, selectPreciseFix } from "@/lib/map/fix-selection"
import type { PositionFix } from "@/lib/map/position-filter"

const BASE: PositionFix = {
  latitude: -18.909,
  longitude: 47.524,
  accuracy: 10,
  timestamp: 1_000,
}

function fix(overrides: Partial<PositionFix>): PositionFix {
  return { ...BASE, ...overrides }
}

describe("isUsableFix", () => {
  it("rejette les coordonnées non finies et les précisions invalides", () => {
    expect(isUsableFix(BASE)).toBe(true)
    expect(isUsableFix(fix({ latitude: Number.NaN }))).toBe(false)
    expect(isUsableFix(fix({ longitude: Number.POSITIVE_INFINITY }))).toBe(false)
    expect(isUsableFix(fix({ accuracy: Number.NaN }))).toBe(false)
    expect(isUsableFix(fix({ accuracy: -1 }))).toBe(false)
  })
})

describe("selectPreciseFix", () => {
  it("choisit le fix le plus précis de la fenêtre, pas le plus récent", () => {
    const coarse = fix({ accuracy: 800, timestamp: 9_000 })
    const precise = fix({ accuracy: 12, timestamp: 6_000 })

    // Fenêtre de 5 s : les deux fix sont dans la fenêtre, le précis gagne.
    expect(selectPreciseFix([precise, coarse], 10_000, 5_000)).toEqual(precise)
  })

  it("préfère le plus récent à précision égale", () => {
    const older = fix({ accuracy: 15, timestamp: 7_000 })
    const newer = fix({ accuracy: 15, timestamp: 9_500 })

    expect(selectPreciseFix([older, newer], 10_000, 5_000)).toEqual(newer)
  })

  it("ignore les fix sortis de la fenêtre", () => {
    const old = fix({ accuracy: 5, timestamp: 1_000 })
    const recent = fix({ accuracy: 40, timestamp: 9_500 })

    expect(selectPreciseFix([old, recent], 10_000, 5_000)).toEqual(recent)
  })

  it("ignore les fix inutilisables", () => {
    const broken = fix({ accuracy: Number.NaN, timestamp: 9_500 })
    const valid = fix({ accuracy: 30, timestamp: 9_000 })

    expect(selectPreciseFix([broken, valid], 10_000, 5_000)).toEqual(valid)
  })

  it("renvoie null sans candidat utilisable", () => {
    expect(selectPreciseFix([], 10_000, 5_000)).toBeNull()
    expect(selectPreciseFix([fix({ accuracy: -2 })], 10_000, 5_000)).toBeNull()
    // Fenêtre invalide : rien n'est sélectionnable.
    expect(selectPreciseFix([BASE], 10_000, 0)).toBeNull()
    expect(selectPreciseFix([BASE], Number.NaN, 5_000)).toBeNull()
  })
})
