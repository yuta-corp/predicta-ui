"use client"

import { DocumentLayout } from "@/components/shell/document-layout"
import { OPEN_CONSENT_EVENT } from "@/components/consent/cookie-consent"

const PURPOSES = [
  {
    name: "Essentiels",
    description:
      "Nécessaires au fonctionnement du site : cookies de session d'authentification (Clerk) lorsque vous êtes connecté, sécurité. Toujours actifs.",
    alwaysOn: true,
  },
  {
    name: "Préférences",
    description:
      "Mémorisent vos choix d'affichage : thème, langue, consentement. Stockées localement sur votre appareil (localStorage).",
    alwaysOn: false,
  },
  {
    name: "Mesure d'audience",
    description:
      "Statistiques anonymes de visite (Vercel Analytics), établies sans dépôt de cookie.",
    alwaysOn: false,
  },
] as const

export default function CookiesPage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Politique cookies"
      intro="Dernière mise à jour : septembre 2026. Predicta privilégie la sobriété : aucun cookie publicitaire, aucun traceur publicitaire tiers. Seuls des cookies essentiels de session (authentification) et vos préférences stockées localement sur votre appareil sont utilisés. La mesure d'audience est anonyme et sans cookie."
    >
      <ul className="divide-y divide-border">
        {PURPOSES.map((p) => (
          <li key={p.name} className="flex items-baseline justify-between gap-6 py-4">
            <span>
              <span className="text-[14px] font-medium">{p.name}</span>
              <span className="mt-1 block max-w-lg text-[12.5px] leading-relaxed text-muted-foreground">
                {p.description}
              </span>
            </span>
            <span className="shrink-0 text-[12px] text-muted-foreground">
              {p.alwaysOn ? "Toujours actifs" : "Votre choix"}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-border/70 pt-6">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
          className="rounded-sm bg-primary px-4 py-2.5 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Modifier mes préférences
        </button>
      </div>
    </DocumentLayout>
  )
}
