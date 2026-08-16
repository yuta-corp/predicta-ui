import { describe, expect, it } from "vitest"
import { TrafficStore, type StoredSource } from "@/lib/traffic/store"
import { buildJsonDocument, rangeAtLine } from "@/lib/geojson/render"
import type { TrafficFeature, TrafficMeta } from "@/lib/types/traffic"

function line(coords: [number, number][]): TrafficFeature {
  return {
    type: "Feature",
    properties: { speed: 30, rate: 0.8 },
    geometry: { type: "LineString", coordinates: coords },
  }
}

function source(key: string, features: TrafficFeature[]): StoredSource {
  return {
    key,
    tag: { kind: "quartier", id: key.slice(2) },
    label: key,
    features,
    meta: { ageMs: null, partial: false, fallback: false, fetchedAt: Date.now() } as TrafficMeta,
    fetchedAt: Date.now(),
  }
}

const A = line([[1, 1], [2, 2]])
const B = line([[3, 3], [4, 4]])

describe("TrafficStore", () => {
  it("deduplicates features across sources by geometry", () => {
    const store = new TrafficStore()
    store.upsert(source("q:a", [A, B]))
    const update = store.upsert(source("q:b", [A]))
    expect(update.added).toHaveLength(0)
    expect(store.total).toBe(2)
  })

  it("updates a source in place on refresh", () => {
    const store = new TrafficStore()
    store.upsert(source("q:a", [A, B]))
    const refreshedA = line([[1, 1], [2, 2]])
    refreshedA.properties.speed = 45
    const update = store.upsert(source("q:a", [refreshedA]))
    // B a disparu (removed), A a été mis à jour en place (pas de re-add).
    expect(update.removed).toBe(1)
    expect(update.added).toHaveLength(0)
    expect(update.updated).toHaveLength(1)
    expect(store.total).toBe(1)
    expect(store.allFeatures()[0]?.properties.speed).toBe(45)
  })

  it("keeps geometry positions when values refresh", () => {
    const store = new TrafficStore()
    store.upsert(source("q:a", [A, B]))
    const refreshedA = line([[1, 1], [2, 2]])
    refreshedA.properties.speed = 60
    const update = store.upsert(source("q:a", [refreshedA, B]))
    expect(update.removed).toBe(0)
    expect(update.added).toHaveLength(0)
    expect(update.updated).toHaveLength(2)
    expect(store.total).toBe(2)
  })

  it("increments revision and keeps lastUpdate", () => {
    const store = new TrafficStore()
    store.upsert(source("q:a", [A]))
    expect(store.lastUpdate?.added).toHaveLength(1)
    store.upsert(source("q:a", [A, B]))
    expect(store.lastUpdate?.added).toHaveLength(1)
    expect(store.total).toBe(2)
  })
})

describe("buildJsonDocument", () => {
  it("indexes per-feature line ranges", () => {
    const doc = buildJsonDocument([A, B], 10)
    expect(doc.lines[0]).toBe("{")
    expect(doc.lines[doc.lines.length - 1]).toBe("}")
    expect(doc.ranges).toHaveLength(2)
    const first = doc.ranges[0]!
    expect(first.end - first.start).toBeGreaterThan(0)
    // le premier feature commence par '{' et expose son type à la ligne suivante
    expect(doc.lines[first.start]).toBe("    {")
    expect(doc.lines[first.start + 1]).toContain('"type": "Feature"')
  })

  it("caps the document and flags it", () => {
    const many = Array.from({ length: 50 }, (_, i) => line([[i, 0], [i, 1]]))
    const doc = buildJsonDocument(many, 10)
    expect(doc.capped).toBe(true)
    expect(doc.ranges).toHaveLength(10)
    expect(doc.total).toBe(50)
  })

  it("finds the range containing a line", () => {
    const doc = buildJsonDocument([A, B])
    const middle = doc.ranges[0]!.end - 1
    expect(rangeAtLine(doc.ranges, middle)?.index).toBe(0)
    const lastLine = doc.lines.length - 1
    expect(rangeAtLine(doc.ranges, lastLine)).toBeNull()
  })
})
