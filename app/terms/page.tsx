import { DocumentLayout } from "@/components/shell/document-layout"

export default function TermsPage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Conditions d'utilisation"
      intro="Dernière mise à jour : août 2026. Document en attente de validation."
    >
      <Section title="1. Objet">
        <p>
          Predicta est un service d'information sur le trafic d'Antananarivo :
          une carte vivante alimentée par l'API Predicta, et une API
          destinée aux développeurs. L'accès à la carte est libre et gratuit.
        </p>
      </Section>
      <Section title="2. Nature des données">
        <p>
          Les données de trafic sont fournies en temps réel, en mode
          best-effort, et peuvent être partielles ou indisponibles. Elles ne
          constituent pas une garantie sur les conditions de circulation :
          ne prenez jamais de décision de conduite fondée uniquement sur ces
          informations.
        </p>
      </Section>
      <Section title="3. Comptes et API">
        <p>
          Les accès à l'API sont régis par une clé par application. Toute
          utilisation abusive, automatisée au-delà des usages raisonnables,
          ou visant à contourner la sécurité est interdite. L'éditeur se
          réserve le droit de révoquer un accès.
        </p>
      </Section>
      <Section title="4. Propriété intellectuelle">
        <p>
          L'interface, l'identité visuelle et la marque Predicta
          appartiennent à [RAISON SOCIALE]. Les données cartographiques
          proviennent d'OpenStreetMap (© OpenStreetMap contributors,
          licence ODbL).
        </p>
      </Section>
      <Section title="5. Responsabilité">
        <p>
          Le service est fourni « en l'état ». [RAISON SOCIALE] ne saurait
          être tenue responsable des interruptions, erreurs ou conséquences
          d'un usage des informations fournies.
        </p>
      </Section>
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
