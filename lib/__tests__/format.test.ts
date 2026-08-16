import { describe, expect, it } from "vitest"
import {
  congestionLabel,
  congestionLevel,
  formatRate,
  formatRelativeTime,
  formatSpeed,
} from "@/lib/format"
import {
  freshnessDetail,
  freshnessFromMeta,
  freshnessLine,
} from "@/lib/traffic/freshness"

describe("format", () => {
  it("formats speed as rounded integer", () => {
    expect(formatSpeed(32.4)).toBe("32")
    expect(formatSpeed(undefined)).toBe("—")
  })
  it("formats rate to two decimals", () => {
    expect(formatRate(0.699999988)).toBe("0.70")
    expect(formatRate(undefined)).toBe("—")
  })
  it("maps rate to congestion levels", () => {
    expect(congestionLevel(0.9)).toBe("fluide")
    expect(congestionLevel(0.6)).toBe("modéré")
    expect(congestionLevel(0.3)).toBe("dense")
    expect(congestionLevel(undefined)).toBe("indisponible")
    expect(congestionLabel(0.9)).toBe("Circulation fluide")
    expect(congestionLabel(0.3)).toBe("Trafic dense")
  })
  it("formats relative time", () => {
    expect(formatRelativeTime(500)).toBe("à l'instant")
    expect(formatRelativeTime(12_000)).toBe("il y a 12 s")
    expect(formatRelativeTime(90_000)).toBe("il y a 1 min")
  })
})

describe("freshness", () => {
  it("derives live/cached/partial/fallback from meta", () => {
    const now = Date.now()
    expect(
      freshnessFromMeta({ ageMs: null, partial: false, fallback: false, fetchedAt: now }, "A").kind
    ).toBe("live")
    expect(
      freshnessFromMeta({ ageMs: 1200, partial: false, fallback: false, fetchedAt: now }, "A").kind
    ).toBe("cached")
    expect(
      freshnessFromMeta({ ageMs: null, partial: true, fallback: false, fetchedAt: now }, "A").kind
    ).toBe("partial")
    expect(
      freshnessFromMeta({ ageMs: null, partial: false, fallback: true, fetchedAt: now }, "A").kind
    ).toBe("fallback")
  })

  it("builds the status line from fetchedAt", () => {
    const now = Date.now()
    const f = freshnessFromMeta(
      { ageMs: null, partial: false, fallback: false, fetchedAt: now - 14_000 },
      "Analakely"
    )
    expect(freshnessLine(f, now)).toContain("il y a 14 s")
  })

  it("adds detail lines for partial and fallback only", () => {
    const now = Date.now()
    const live = freshnessFromMeta(
      { ageMs: null, partial: false, fallback: false, fetchedAt: now },
      "A"
    )
    expect(freshnessDetail(live)).toBeNull()
    const partial = freshnessFromMeta(
      { ageMs: null, partial: true, fallback: false, fetchedAt: now },
      "A"
    )
    expect(freshnessDetail(partial)).toContain("routes manquent")
  })
})
