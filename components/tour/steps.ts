/**
 * Étapes de la visite guidée de la carte.
 * `target` pointe un élément de l'interface via un sélecteur CSS ; sans
 * `target`, l'étape s'affiche centrée (spotlight sur toute la carte).
 */

export interface TourStep {
  id: string
  title: string
  body: string
  /** Sélecteur CSS de la cible à mettre en avant. */
  target?: string
  /** Étapes facultatives : ignorées si la cible est absente (ex. hors connexion). */
  optional?: boolean
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Bienvenue sur Predicta",
    body: "La carte du trafic d'Antananarivo en temps réel. On vous montre les essentiels en quelques pas.",
  },
  {
    id: "search",
    title: "Rechercher un quartier",
    body: "Tapez le nom d'un quartier (ex. Analakely) pour recentrer la carte. Raccourci : ⌘K / Ctrl+K.",
    target: '[aria-label="Rechercher un quartier"]',
  },
  {
    id: "legend",
    title: "Lire les couleurs",
    body: "La palette indique l'état du trafic : vert = fluide, orange = modéré, rouge = dense, gris = indisponible.",
    target: '[aria-label="Légende du trafic"]',
  },
  {
    id: "route",
    title: "Explorer une route",
    body: "Cliquez sur une route colorée pour ouvrir ses détails : vitesse observée, taux de congestion et quartier.",
  },
  {
    id: "3d",
    title: "Vue 3D",
    body: "Inclinez la carte pour faire apparaître le relief et les bâtiments d'Antananarivo.",
    target: '[aria-label="Incliner la carte"]',
  },
  {
    id: "position",
    title: "Ma position",
    body: "Le bouton géolocalisation vous situe sur la carte, même hors de Tana.",
    target: '[aria-label="Voir ma position"]',
  },
  {
    id: "friends",
    title: "Avec vos amis",
    body: "Ajoutez des amis et retrouvez leur position en temps réel, si vous le souhaitez.",
    target: 'a[href="/friends"]',
    optional: true,
  },
]