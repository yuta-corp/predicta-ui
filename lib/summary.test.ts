import assert from "node:assert/strict"
import { computeLiveSummary } from "./summary.ts"
import type { TrafficCollection } from "./api.ts"

const fc: TrafficCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { speed: 30, rate: 0.9 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
    { type: "Feature", properties: { speed: 10, rate: 0.3 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
    { type: "Feature", properties: { speed: 20, rate: 0.4 }, geometry: { type: "LineString", coordinates: [[0,0],[1,1]] } },
  ],
}
const s = computeLiveSummary(fc)
assert.equal(s.total, 3)
assert.equal(s.avgSpeed, 20)          // (30+10+20)/3
assert.equal(s.pctCongested, 67)      // 2 of 3 have rate < 0.5 → round(66.6)
assert.deepEqual(computeLiveSummary(null), { avgSpeed: null, pctCongested: null, total: 0 })

console.log("summary.test: all passed")
