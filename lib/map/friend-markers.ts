import { formatAccuracy, formatRelativeTime } from "@/lib/format"
import { accuracyCircle } from "@/lib/map/user-location"

/**
 * Rendu des positions d'amis sur la carte : cercle de précision (GeoJSON) et
 * marqueur DOM. Fonctions pures côté données (bornées, validées) ; le marqueur
 * et sa popup sont construits en DOM pour rester indépendants de React.
 */

/** Délai (ms) après lequel une position d'ami est affichée comme vieillissante. */
export const FRIEND_STALE_AFTER_MS = 2 * 60_000

/** Nombre maximal d'amis dessinés (borne dure de la boucle de rendu). */
export const MAX_FRIENDS_ON_MAP = 100

/** Rayon maximal (m) du cercle de précision — au-delà, la ville entière clignote. */
export const MAX_ACCURACY_RADIUS_M = 5_000

/** Données minimales nécessaires pour dessiner un ami (compatible FriendLocation). */
export interface FriendMarkerInput {
  userId: string
  name: string
  imageUrl: string | null
  latitude: number
  longitude: number
  accuracy: number | null
  updatedAt: Date
}

interface AccuracyFeature {
  type: "Feature"
  geometry: { type: "Polygon"; coordinates: [number, number][][] }
  properties: { userId: string }
}

interface AccuracyFeatureCollection {
  type: "FeatureCollection"
  features: AccuracyFeature[]
}

const EMPTY_FEATURES: AccuracyFeatureCollection = {
  type: "FeatureCollection",
  features: [],
}

/**
 * Cercles de précision des amis (un polygone par précision connue). Un ami sans
 * précision n'a pas de cercle : un point sans marge serait un mensonge.
 */
export function buildFriendAccuracyGeoJson(
  locations: readonly FriendMarkerInput[]
): AccuracyFeatureCollection {
  if (locations.length === 0) return EMPTY_FEATURES

  const features: AccuracyFeature[] = []
  const count = Math.min(locations.length, MAX_FRIENDS_ON_MAP)
  for (let index = 0; index < count; index += 1) {
    const location = locations[index]
    const accuracy = location.accuracy
    if (
      typeof accuracy !== "number" ||
      !Number.isFinite(accuracy) ||
      accuracy <= 0
    ) {
      continue
    }
    features.push({
      type: "Feature",
      geometry: accuracyCircle(
        location.longitude,
        location.latitude,
        Math.min(accuracy, MAX_ACCURACY_RADIUS_M)
      ),
      properties: { userId: location.userId },
    })
  }
  return { type: "FeatureCollection", features }
}

/** Vrai quand la position de l'ami accuse un retard d'affichage notable. */
export function isStaleFriendLocation(
  updatedAt: Date,
  nowMs: number
): boolean {
  return nowMs - updatedAt.getTime() > FRIEND_STALE_AFTER_MS
}

/** Libellé d'ancienneté : « mis à jour il y a 2 min ». */
export function friendFreshnessLabel(updatedAt: Date, nowMs: number): string {
  return `mis à jour ${formatRelativeTime(Math.max(0, nowMs - updatedAt.getTime()))}`
}

/**
 * Marqueur d'un ami : pastille avec sa photo (ou son initiale), anneau bleu,
 * atténué quand la position n'est plus fraîche.
 */
export function buildFriendMarkerElement(
  location: FriendMarkerInput,
  nowMs: number
): HTMLElement {
  const stale = isStaleFriendLocation(location.updatedAt, nowMs)
  const element = document.createElement("div")
  element.className = [
    "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-600 text-[13px] font-semibold text-white shadow-md transition-opacity",
    stale ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ")
  element.setAttribute("role", "img")
  element.setAttribute(
    "aria-label",
    `${location.name}, ${friendFreshnessLabel(location.updatedAt, nowMs)}`
  )

  if (location.imageUrl) {
    const image = document.createElement("img")
    image.src = location.imageUrl
    image.alt = ""
    image.className = "h-full w-full object-cover"
    element.appendChild(image)
  } else {
    element.textContent = location.name.charAt(0).toUpperCase()
  }

  return element
}

/**
 * Contenu de la popup d'un ami : identité, fraîcheur, précision réelle de sa
 * position, et bouton de recentrage (la caméra revient sur lui sans quitter la
 * carte).
 */
export function buildFriendPopupElement(
  location: FriendMarkerInput,
  nowMs: number,
  onRecenter: () => void
): HTMLElement {
  const content = document.createElement("div")
  content.className = "flex min-w-40 flex-col gap-1 p-1"

  const name = document.createElement("p")
  name.className = "text-sm font-semibold"
  name.textContent = location.name

  const freshness = document.createElement("p")
  freshness.className = "text-xs text-muted-foreground"
  freshness.textContent = friendFreshnessLabel(location.updatedAt, nowMs)

  const accuracy = document.createElement("p")
  accuracy.className = "text-xs text-muted-foreground"
  accuracy.textContent = `Position ${formatAccuracy(location.accuracy)}`

  const recenter = document.createElement("button")
  recenter.type = "button"
  recenter.className =
    "mt-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
  recenter.textContent = "Recentrer la carte"
  recenter.addEventListener("click", (event) => {
    event.stopPropagation()
    onRecenter()
  })

  content.append(name, freshness, accuracy, recenter)
  return content
}
