import { DocumentLayout } from "@/components/shell/document-layout"

export default function TermsOfSalePage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Conditions de vente"
      intro="Dernière mise à jour : août 2026. Document en attente de validation."
    >
      <Section title="Offres">
        <p>
          Predicta est actuellement en préproduction : aucune offre
          commerciale n'est en vente. Les conditions ci-dessous s'appliqueront
          aux futures offres (abonnement API, accès privilégiés) dès leur
          mise en ligne.
        </p>
      </Section>
      <Section title="Modalités">
        <p>
          [RAISON SOCIALE], [ADRESSE], immatriculée [NUMÉRO
          D'IMMATRICULATION]. Paiement, facturation, droit de rétractation :
          les modalités détaillées seront publiées lors du lancement des
          offres. Contact : [EMAIL].
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
