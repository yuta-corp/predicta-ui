import { DocumentLayout } from "@/components/shell/document-layout"

export default function TermsOfSalePage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Conditions de vente"
      intro="Dernière mise à jour : août 2026."
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
          Predicta est édité par ANDRIAMAMIVONY Tiavintsoa Ulrich (éditeur
          individuel), IVH80 Mandialaza — Madagascar, en partenariat avec
          MAERI Consulting (Toamasina). Paiement, facturation, droit de
          rétractation : les modalités détaillées seront publiées lors du
          lancement des offres. Contact : yuta-mg@proton.me.
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
