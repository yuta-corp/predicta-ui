#!/usr/bin/env node
/**
 * Génère lib/data/quartiers.ts depuis la migration SQL du backend Predicta
 * (V1__quartiers.sql). L'API /quartiers n'expose pas la clé primaire
 * (quartier_id) ; ce catalogue local la fournit pour l'endpoint
 * /traffic/quartier/{id}.
 *
 * Usage : node scripts/generate-quartiers.mjs [chemin/vers/V1__quartiers.sql]
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sqlPath =
  process.argv[2] ??
  resolve(root, "../predictaapi/src/main/resources/db/migration/V1__quartiers.sql")

let sql
try {
  sql = readFileSync(sqlPath, "utf8")
} catch {
  console.error(
    `[generate-quartiers] Fichier SQL introuvable : ${sqlPath}\n` +
      "Passez le chemin en argument : node scripts/generate-quartiers.mjs <V1__quartiers.sql>"
  )
  process.exit(1)
}

// INSERT rows : ('id', 'name', 'source', lon, lat) — l'apostrophe SQL est
// échappée par '' (ex. 'Fasan''ny Karàna').
const ROW = /^\('((?:[^']|'')+)', '((?:[^']|'')+)', '((?:[^']|'')+)', ([\d.]+), (-?[\d.]+)\)/gm
const unescape = (s) => s.replace(/''/g, "'")

const quartiers = []
let match
while ((match = ROW.exec(sql)) !== null) {
  const [, id, name, source, lon, lat] = match
  quartiers.push({
    id: unescape(id),
    name: unescape(name),
    source: unescape(source),
    lon: Number(lon),
    lat: Number(lat),
  })
}

if (quartiers.length === 0) {
  console.error("[generate-quartiers] Aucun quartier parsé — SQL inattendu.")
  process.exit(1)
}

quartiers.sort((a, b) => a.name.localeCompare(b.name, "fr"))

const byId = Object.fromEntries(quartiers.map((q) => [q.id, q]))
const byLowerName = Object.fromEntries(
  quartiers.map((q) => [q.name.toLocaleLowerCase("fr"), q])
)

const row = (q) =>
  `  { id: ${JSON.stringify(q.id)}, name: ${JSON.stringify(
    q.name
  )}, source: ${JSON.stringify(q.source)}, lon: ${q.lon}, lat: ${q.lat} },`

const out = `/**
 * Catalogue des quartiers d'Antananarivo — GÉNÉRÉ, ne pas éditer à la main.
 * Source : V1__quartiers.sql (migration Predicta API).
 * Contient la clé primaire (quartier_id) absente de l'endpoint /quartiers,
 * nécessaire à GET /traffic/quartier/{id}.
 *
 * Régénérer : pnpm generate:quartiers
 */

import type { Quartier } from "@/lib/types/traffic"

export const quartiers: readonly Quartier[] = [
${quartiers.map(row).join("\n")}
]

export const quartiersById: Readonly<Record<string, Quartier>> = ${JSON.stringify(
  byId,
  null,
  2
)}

export const quartiersByLowerName: Readonly<Record<string, Quartier>> = ${JSON.stringify(
  byLowerName,
  null,
  2
)}
`

const outPath = resolve(root, "lib/data/quartiers.ts")
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, out)

const ids = new Set(quartiers.map((q) => q.id))
console.log(
  `[generate-quartiers] ${quartiers.length} quartiers → lib/data/quartiers.ts` +
    ` (ids uniques : ${ids.size === quartiers.length ? "oui" : "NON"})`
)
