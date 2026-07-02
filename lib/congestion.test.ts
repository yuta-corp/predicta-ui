import assert from "node:assert/strict"
import { congestionBucket } from "./congestion.ts"

// boundaries are inclusive at the lower edge of the higher bucket
assert.equal(congestionBucket(0.9), "fluide")
assert.equal(congestionBucket(0.75), "fluide")
assert.equal(congestionBucket(0.74), "moyen")
assert.equal(congestionBucket(0.5), "moyen")
assert.equal(congestionBucket(0.49), "lent")
assert.equal(congestionBucket(0.25), "lent")
assert.equal(congestionBucket(0.24), "bloque")
assert.equal(congestionBucket(0), "bloque")
assert.equal(congestionBucket(undefined), "inconnu")

console.log("congestion.test: all passed")
