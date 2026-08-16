import Link from "next/link"
import { DocumentLayout } from "@/components/shell/document-layout"

const SECTIONS = [
  {
    href: "/privacy",
    title: "Confidentialité",
    text: "Quelles données Predicta traite, comment, et quels sont vos droits.",
  },
  {
    href: "/terms",
    title: "Conditions d'utilisation",
    text: "Les règles d'usage du service, de la carte vivante et de l'API.",
  },
  {
    href: "/terms-of-sale",
    title: "Conditions de vente",
    text: "Les modalités commerciales des offres Predicta (API, abonnements).",
  },
  {
    href: "/cookies",
    title: "Cookies",
    text: "Ce que nous déposons, pourquoi, et comment modifier vos préférences.",
  },
  {
    href: "/privacy-center",
    title: "Centre de confidentialité",
    text: "Gérez vos préférences, exportez vos données, supprimez votre compte.",
  },
] as const

const ENTITY = [
  ["Éditeur du service", "[RAISON SOCIALE], société [FORME JURIDIQUE] au capital de [CAPITAL] €"],
  ["Siège social", "[ADRESSE COMPLÈTE]"],
  ["Immatriculation", "RCS [VILLE] [NUMÉRO] — TVA intracommunautaire [NUMÉRO]"],
  ["Directeur de la publication", "[PRÉNOM NOM]"],
  ["Hébergement", "Vercel Inc., 340 Brannan Street, Suite 400, San Francisco, CA 94107, États-Unis"],
  ["Contact", "[EMAIL CONTACT] — réponse sous 48 h ouvrées"],
] as const

export default function LegalPage() {
  return (
    <DocumentLayout
      eyebrow="Mentions légales"
      title="Mentions légales"
      intro="Les informations légales du service Predicta, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
    >
      <dl className="mb-12 divide-y divide-border">
        {ENTITY.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-6"
          >
            <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </dt>
            <dd className="text-[13.5px] leading-relaxed text-foreground/85">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <Section title="1. Objet du service">
        <p>
          Predicta est un service d'information sur le trafic d'Antananarivo :
          une carte vivante alimentée par l'API Predicta, et une API destinée
          aux développeurs. L'accès à la carte est libre et gratuit.
        </p>
      </Section>
      <Section title="2. Données cartographiques">
        <p>
          Le fond de carte provient d'OpenStreetMap et d'OpenFreeMap. Les
          données de trafic sont issues de sources publiques agrégées et sont
          fournies en mode best-effort : elles peuvent être partielles,
          retardées ou indisponibles, et ne constituent jamais une garantie
          sur les conditions de circulation.
        </p>
      </Section>
      <Section title="3. Propriété intellectuelle">
        <p>
          L'interface, l'identité visuelle, le logotype et la marque Predicta
          appartiennent à [RAISON SOCIALE]. Toute reproduction ou
          réutilisation sans autorisation préalable est interdite, hors usage
          privé. Les données OpenStreetMap sont publiées sous licence ODbL
          (© OpenStreetMap contributors).
        </p>
      </Section>
      <Section title="4. Responsabilité">
        <p>
          Le service est fourni « en l'état ». [RAISON SOCIALE] ne saurait
          être tenue responsable des interruptions, erreurs, ou conséquences
          d'un usage des informations fournies. Les conditions détaillées
          figurent dans les conditions d'utilisation.
        </p>
      </Section>

      <h2 className="mt-14 text-[15px] font-semibold tracking-tight">
        Autres documents juridiques
      </h2>
      <ul className="mt-2 divide-y divide-border">
        {SECTIONS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex items-baseline justify-between gap-6 py-4 transition-colors"
            >
              <span>
                <span className="text-[14.5px] font-medium group-hover:text-primary">
                  {s.title}
                </span>
                <span className="mt-0.5 block max-w-lg text-[13px] text-muted-foreground">
                  {s.text}
                </span>
              </span>
              <span aria-hidden className="text-muted-foreground group-hover:text-primary">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DocumentLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  )
}
