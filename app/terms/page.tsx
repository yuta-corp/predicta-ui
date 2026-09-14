import type { ReactNode } from "react"
import { DocumentLayout } from "@/components/shell/document-layout"

const SECTIONS = [
  {
    title: "1. Objet",
    body: (
      <p>
        Predicta est un service d'information sur le trafic d'Antananarivo :
        une carte vivante alimentée par l'API Predicta et des fonctionnalités
        sociales (amis, partage de position, notifications). La consultation
        de la carte et les fonctionnalités sociales nécessitent la création
        d'un compte, dont l'inscription est gratuite.
      </p>
    ),
  },
  {
    title: "2. Nature des données",
    body: (
      <p>
        Les données de trafic sont fournies en temps réel, en mode
        best-effort, et peuvent être partielles ou indisponibles. Elles ne
        constituent pas une garantie sur les conditions de circulation : ne
        prenez jamais de décision de conduite fondée uniquement sur ces
        informations.
      </p>
    ),
  },
  {
    title: "3. Comptes",
    body: (
      <p>
        La création d'un compte est gratuite et réservée aux personnes
        physiques ou morales capables d'engager leur responsabilité. Vous êtes
        responsable de la confidentialité de vos identifiants (gérés par notre
        fournisseur d'authentification Clerk) et de toute utilisation de votre
        compte. Vous vous engagez à fournir une information exacte, à ne pas
        usurper l'identité d'autrui et à choisir un pseudo unique, disponible
        et non trompeur. Vous pouvez supprimer votre compte à tout moment
        depuis votre espace Clerk.
      </p>
    ),
  },
  {
    title: "4. Partage de position",
    body: (
      <p>
        Le partage de position est strictement volontaire et opt-in. Vous
        contrôlez à qui elle est visible (amis explicitement autorisés ou lien
        secret à durée limitée de 24 h) et pouvez l'arrêter à tout moment. En
        partageant votre position, vous confirmez être autorisé à le faire et
        vous engagez à ne pas l'utiliser pour nuire à autrui ou enfreindre les
        lois applicables.
      </p>
    ),
  },
  {
    title: "5. Contenus et comportement",
    body: (
      <p>
        Il est interdit d'utiliser le service pour : harceler ou nuire à un
        autre utilisateur, usurper une identité, diffuser des contenus
        illicites, contourner les mesures de sécurité, ou collecter à grande
        échelle les données du service sans autorisation.
      </p>
    ),
  },
  {
    title: "6. Propriété intellectuelle",
    body: (
      <p>
        L'interface, l'identité visuelle et la marque Predicta appartiennent à
        l'éditeur du service. Les données cartographiques proviennent
        d'OpenStreetMap (© OpenStreetMap contributors, licence ODbL).
      </p>
    ),
  },
  {
    title: "7. Responsabilité",
    body: (
      <p>
        Le service est fourni « en l'état ». L'éditeur ne saurait être tenu
        responsable des interruptions, erreurs ou conséquences d'un usage des
        informations fournies.
      </p>
    ),
  },
  {
    title: "8. Suspension et résiliation",
    body: (
      <p>
        En cas de manquement aux présentes conditions, l'éditeur peut
        suspendre ou résilier l'accès d'un utilisateur, après
        avertissement lorsque cela est possible. La suppression d'un compte
        efface les données associées conformément à la{" "}
        <a className="underline decoration-primary/50 underline-offset-4" href="/privacy">
          politique de confidentialité
        </a>
        .
      </p>
    ),
  },
  {
    title: "9. Évolution des conditions",
    body: (
      <p>
        Les présentes conditions peuvent évoluer ; la date de dernière mise à
        jour figure en tête de page et les conditions en vigueur sont celles
        publiées à la date de votre utilisation.
      </p>
    ),
  },
] satisfies { title: string; body: ReactNode }[]

export default function TermsPage() {
  return (
    <DocumentLayout
      eyebrow="Legal"
      title="Conditions d'utilisation"
      intro="Dernière mise à jour : septembre 2026."
    >
      {SECTIONS.map((s) => (
        <Section key={s.title} title={s.title}>
          {s.body}
        </Section>
      ))}
    </DocumentLayout>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  )
}