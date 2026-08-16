import { DocumentLayout } from "@/components/shell/document-layout"

export default function PrivacyPage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Politique de confidentialité"
      intro="Dernière mise à jour : août 2026."
    >
      <Section title="1. Responsable du traitement">
        <p>
          Predicta est édité par ANDRIAMAMIVONY Tiavintsoa Ulrich (éditeur
          individuel), IVH80 Mandialaza — Madagascar. Responsable de la
          publication : ANDRIAMAMIVONY Tiavintsoa Ulrich. Contact :
          yuta-mg@proton.me.
        </p>
      </Section>
      <Section title="2. Données traitées">
        <p>
          L'application Predicta affiche le trafic d'Antananarivo tel que
          fourni par l'API Predicta (données OpenStreetMap, © OSM
          contributors). L'application ne collecte pas de localisation
          utilisateur et n'exige aucun compte pour consulter la carte.
        </p>
        <p className="mt-3">
          Les données éventuellement traitées sont limitées à celles que vous
          fournissez volontairement (par exemple lors d'une demande de contact
          ou d'export) et aux préférences stockées localement sur votre
          appareil (thème, consentement cookies).
        </p>
      </Section>
      <Section title="3. Cookies">
        <p>
          Predicta utilise uniquement les cookies strictement nécessaires au
          fonctionnement du site (préférences). Aucun cookie publicitaire ni
          de suivi n'est déposé. Voir la{" "}
          <a className="underline decoration-primary/50 underline-offset-4" href="/cookies">
            politique cookies
          </a>
          .
        </p>
      </Section>
      <Section title="4. Durée de conservation et droits">
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement,
          de portabilité et d'opposition sur vos données. Pour exercer ces
          droits, contactez yuta-mg@proton.me. Le{" "}
          <a className="underline decoration-primary/50 underline-offset-4" href="/privacy-center">
            centre de confidentialité
          </a>{" "}
          permet de gérer vos préférences et de demander l'export ou la
          suppression de vos données.
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
