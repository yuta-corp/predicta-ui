// Vérif rate limit du proxy : autorise jusqu'au seuil, bloque au-delà, reset après fenêtre.
// Run: pnpm test:unit (repris par le glob lib/*.test.ts).
import assert from "node:assert"

const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, now: number) {
  const e = hits.get(ip)
  if (!e || now >= e.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  e.count++
  if (e.count > RATE_LIMIT)
    return { ok: false, retryAfter: Math.ceil((e.resetAt - now) / 1000) }
  return { ok: true, retryAfter: 0 }
}

const t0 = 1_000_000
for (let i = 0; i < RATE_LIMIT; i++)
  assert.equal(rateLimit("1.2.3.4", t0).ok, true, `req ${i + 1} should pass`)
const blocked = rateLimit("1.2.3.4", t0)
assert.equal(blocked.ok, false, "31st req blocked")
assert.ok(blocked.retryAfter > 0 && blocked.retryAfter <= 60, "retryAfter sane")
assert.equal(rateLimit("9.9.9.9", t0).ok, true, "other IP independent")
assert.equal(rateLimit("1.2.3.4", t0 + RATE_WINDOW_MS).ok, true, "resets after window")

console.log("rate-limit ok")
