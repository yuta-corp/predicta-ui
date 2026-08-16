"use client"

import Link from "next/link"
import { DocumentLayout } from "@/components/shell/document-layout"
import { OPEN_CONSENT_EVENT } from "@/components/consent/cookie-consent"

const ACTIONS = [
  {
    title: "Préférences cookies",
    text: "Revoir votre consentement et personnaliser les catégories.",
    action: "open-consent" as const,
  },
  {
    title: "Exporter mes données",
    text: "Demander une copie des données liées à vos préférences.",
    href: "/account#export",
  },
  {
    title: "Supprimer mon compte",
    text: "Comprendre les conséquences avant de lancer une demande.",
    href: "/account#delete",
  },
  {
    title: "Contact confidentialité",
    text: "Questions ou demandes relatives à vos données.",
    href: "mailto:[EMAIL]?subject=Confidentialit%C3%A9",
  },
] as const

export default function PrivacyCenterPage() {
  return (
    <DocumentLayout
      eyebrow="Vos droits"
      title="Centre de confidentialité"
      intro="Tout ce qui touche à vos données, au même endroit. Predicta ne stocke à ce jour aucune donnée personnelle : les actions ci-dessous couvrent vos préférences locales et vos demandes."
    >
      <ul className="divide-y divide-border">
        {ACTIONS.map((a) => (
          <li key={a.title}>
            {"action" in a ? (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
                className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
              >
                <ActionText title={a.title} text={a.text} />
              </button>
            ) : (
              <Link
                href={a.href}
                className="group flex items-baseline justify-between gap-6 py-5"
              >
                <ActionText title={a.title} text={a.text} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </DocumentLayout>
  )
}

function ActionText({ title, text }: { title: string; text: string }) {
  return (
    <span>
      <span className="text-[15px] font-medium group-hover:text-primary">{title}</span>
      <span className="mt-1 block max-w-lg text-[13px] text-muted-foreground">{text}</span>
    </span>
  )
}
