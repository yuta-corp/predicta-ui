import { chromium } from "@playwright/test"
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on("console", m => { if (m.type()==="error") errs.push(m.text()) })
p.on("pageerror", e => errs.push("PAGEERR: "+e.message))
await p.goto("http://localhost:3000", { waitUntil: "domcontentloaded" })
await p.waitForTimeout(4500)
const r = await p.evaluate(() => {
  const canvas = document.querySelector("canvas.maplibregl-canvas")
  const txt = document.body.innerText
  const glass = document.querySelector('[class*="backdrop-blur"]')
  return {
    hasCanvas: !!canvas,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    loaderGone: !document.body.innerText.includes("Initialisation"),
    overlaysText: txt.replace(/\n+/g," | ").slice(0,300),
    hasSearch: !!document.querySelector('input[placeholder*="quartier"]'),
    hasGlassPanel: !!glass,
    tilesLoaded: window.__ml_tiles ?? "n/a",
  }
})
console.log(JSON.stringify({r, errs: errs.slice(0,8)}, null, 0))
await b.close()
