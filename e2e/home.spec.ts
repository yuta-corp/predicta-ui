import { test, expect, type Page } from "@playwright/test"

// FeatureCollection minimal servie à la place du vrai backend.
const TRAFFIC = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Rue A", quartierId: "rel_1", speed: 40, rate: 0.9 },
      geometry: { type: "LineString", coordinates: [[47.52, -18.88], [47.53, -18.89]] },
    },
    {
      type: "Feature",
      properties: { name: "Rue B", quartierId: "rel_1", speed: 8, rate: 0.2 },
      geometry: { type: "LineString", coordinates: [[47.51, -18.90], [47.52, -18.91]] },
    },
  ],
}

// Coupe tout réseau externe (fond de carte MapLibre / OpenFreeMap) pour un test hermétique et
// rapide. Les overlays (stats, légende, recherche) se rendent indépendamment du fond de carte.
async function mockBackend(page: Page, opts: { partial?: boolean } = {}) {
  await page.route("**/api/proxy/traffic**", (route) =>
    route.fulfill({
      status: 200,
      headers: {
        "content-type": "application/geo+json",
        ...(opts.partial ? { "X-Predicta-Partial": "true" } : {}),
      },
      body: JSON.stringify(TRAFFIC),
    }),
  )
  // Recherche quartier = filtrage client sur seed statique (lib/quartiers.json), aucun réseau.
  // Fond de carte : style MapLibre minimal hors-ligne (fond uni, zéro source réseau). Le map émet
  // "load" instantanément -> le fetch trafic (gated sur "load") part -> onData alimente les stats.
  await page.route(/tiles\.openfreemap\.org\/styles\//, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        version: 8,
        sources: {},
        layers: [{ id: "bg", type: "background", paint: { "background-color": "#0A0A0A" } }],
        glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
      }),
    }),
  )
  // Toute autre ressource carto (glyphs, tuiles) : abandon, MapLibre encaisse.
  await page.route(/\.pbf|\.png|fonts/, (route) => route.abort())
}

test("la home charge et affiche les stats live depuis le trafic", async ({ page }) => {
  await mockBackend(page)
  await page.goto("/")

  await expect(page.getByText("Predicta")).toBeVisible()
  await expect(page.getByText("En direct")).toBeVisible()

  // avg speed = (40+8)/2 = 24 ; 1/2 embouteillé (rate<=0.25) = 50%.
  await expect(page.getByText("24", { exact: false })).toBeVisible()
  await expect(page.getByText("50% embouteillé · 2 rues")).toBeVisible()

  // légende des 4 buckets.
  await expect(page.getByText("Congestion")).toBeVisible()
  await expect(page.getByText("Fluide")).toBeVisible()
})

test("la bannière partielle s'affiche quand le backend est partiel", async ({ page }) => {
  await mockBackend(page, { partial: true })
  await page.goto("/")
  await expect(page.getByText("Données partielles")).toBeVisible()
})

test("la recherche de quartier filtre et propose des résultats", async ({ page }) => {
  await mockBackend(page)
  await page.goto("/")

  // attendre que l'intro (loader plein écran) se retire avant d'interagir (init carte + minMs + fondu).
  await expect(page.getByRole("progressbar")).toHaveCount(0, { timeout: 15000 })

  const input = page.getByPlaceholder("Chercher un quartier…")
  // filtrage instantané côté client sur le seed statique ; "ambohipo" match, pas "analakely".
  await input.fill("ambohipo")
  await expect(page.getByText("Ambohipo", { exact: true })).toBeVisible()
  await expect(page.getByText("Analakely")).toHaveCount(0)

  // sélection : recentre (flyTo) et remplit l'input sans planter.
  await page.getByText("Ambohipo", { exact: true }).first().click()
  await expect(input).toHaveValue("Ambohipo")
})
