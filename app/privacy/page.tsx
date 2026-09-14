import type { ReactNode } from "react"
import { DocumentLayout } from "@/components/shell/document-layout"

const INTRO =
  "Dernière mise à jour : septembre 2026. Cette politique décrit les données que Predicta peut traiter, dans quel but, combien de temps elles sont conservées et comment vous pouvez exercer vos droits."

const CONTACT =
  "mailto:yuta-mg@proton.me?subject=Confidentialit%C3%A9"

const SECTIONS = [
  {
    title: "1. Responsable du traitement",
    body: (
      <>
        <p>
          Predicta est édité par ANDRIAMAMIVONY Tiavintsoa Ulrich (éditeur
          individuel), IVH80 Mandialaza — Madagascar, en partenariat avec MAERI
          Consulting (Toamasina). Responsable de la publication :
          ANDRIAMAMIVONY Tiavintsoa Ulrich. Pour toute question relative à la
          protection des données :{" "}
          <a className="underline decoration-primary/50 underline-offset-4" href={CONTACT}>
            yuta-mg@proton.me
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "2. Données traitées",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">
            Consultation de la carte (sans compte).
          </strong>{" "}
          La carte affiche le trafic d'Antananarivo tel que fourni par l'API
          Predicta (fond de carte OpenStreetMap, © OSM contributors). Aucun
          compte n'est requis pour la consulter et la carte ne collecte pas
          votre localisation. Si vous activez la géolocalisation du navigateur,
          votre position n'est traitée que sur votre appareil pour placer le
          repère sur la carte : elle n'est jamais transmise ni stockée par
          Predicta.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Compte (facultatif).
          </strong>{" "}
          Les fonctionnalités sociales (amis, partage de position,
          notifications) exigent un compte, géré par notre fournisseur
          d'authentification Clerk. Sont alors enregistrées : votre adresse
          électronique, votre prénom et nom (selon ce que vous fournissez),
          votre photo de profil et votre pseudo.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Relations sociales.
          </strong>{" "}
          La liste de vos amis ainsi que le statut des demandes (en attente,
          acceptée, refusée) sont enregistrés pour faire fonctionner le
          service.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Partage de position (opt-in).
          </strong>{" "}
          Uniquement pendant une session de partage que vous lancez, votre
          position géographique et sa précision sont enregistrées côté serveur
          (mise à jour toutes les 30 s). Elles ne sont lisibles que par les
          amis que vous avez explicitement autorisés, ou par les détenteurs
          d'un lien secret à durée limitée (24 h). Les positions de plus de
          5 minutes sont ignorées ; l'arrêt du partage supprime immédiatement
          la position enregistrée.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Notifications.
          </strong>{" "}
          Si vous les activez, votre navigateur enregistre un abonnement Web
          Push (endpoint technique auprès du service de notifications du
          navigateur) afin de vous notifier même lorsque l'application est
          fermée.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Mesure d'audience.
          </strong>{" "}
          Des statistiques de fréquentation anonymes sont établies sans dépôt
          de cookie, via le service d'analyse de notre hébergeur (Vercel) :
          aucune donnée personnelle n'en est déduite.
        </p>
      </>
    ),
  },
  {
    title: "3. Base légale",
    body: (
      <p>
        Les traitements reposent sur : l'exécution du service que vous
        demandez (compte, amis, partage de position), votre consentement
        (partage de position, notifications, choix de cookies) et l'intérêt
        légitime de l'éditeur (sécurité du service, lutte contre les abus).
      </p>
    ),
  },
  {
    title: "4. Cookies et stockage local",
    body: (
      <p>
        Les cookies se limitent à ceux strictement nécessaires à
        l'authentification (Clerk) lorsque vous êtes connecté. Vos préférences
        (thème, consentement) sont stockées localement sur votre appareil. La
        mesure d'audience est effectuée sans cookie. Aucun cookie publicitaire
        ni traceur publicitaire n'est déposé. Voir la{" "}
        <a className="underline decoration-primary/50 underline-offset-4" href="/cookies">
          politique cookies
        </a>
        .
      </p>
    ),
  },
  {
    title: "5. Durée de conservation",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">
            Données de compte :
          </strong>{" "}
          tant que votre compte existe. La suppression du compte (depuis votre
          espace Clerk) entraîne la suppression en cascade de vos données
          locales (amis, positions, liens de partage, abonnements push).
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Relations sociales :
          </strong>{" "}
          supprimables à tout moment depuis l'application, supprimées avec le
          compte.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Positions partagées :
          </strong>{" "}
          supprimées à l'arrêt du partage ; sinon ignorées au-delà de
          5 minutes. Les liens de partage expirent au bout de 24 h et sont
          révocables à tout moment.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Abonnements push :
          </strong>{" "}
          supprimés lorsque vous les désactivez ou avec votre compte.
        </p>
        <p className="mt-3">
          <strong className="font-medium text-foreground">
            Préférences locales :
          </strong>{" "}
          stockées sur votre appareil, supprimables avec les données du
          navigateur.
        </p>
      </>
    ),
  },
  {
    title: "6. Vos droits",
    body: (
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de
        portabilité, d'opposition et de limitation sur vos données. Vous pouvez
        les exercer grâce au{" "}
        <a className="underline decoration-primary/50 underline-offset-4" href="/privacy-center">
          centre de confidentialité
        </a>{" "}
        ou par courriel à{" "}
        <a className="underline decoration-primary/50 underline-offset-4" href={CONTACT}>
          yuta-mg@proton.me
        </a>
        . Une réponse est apportée sous 48 h ouvrées.
      </p>
    ),
  },
  {
    title: "7. Hébergement et sous-traitants",
    body: (
      <p>
        Les données sont hébergées par nos sous-traitants : Vercel Inc.
        (hébergement de l'application et mesure d'audience), Clerk
        (authentification et gestion des comptes) et Neon Inc. (base de
        données PostgreSQL, hébergée dans la région AWS us-east-2). Les
        données sont chiffrées en transit (TLS) et l'accès aux traitements est
        limité aux seules personnes autorisées.
      </p>
    ),
  },
  {
    title: "8. Évolution de la politique",
    body: (
      <p>
        Toute évolution substantielle de cette politique sera signalée sur
        cette page, dont la date de dernière mise à jour figure en tête.
      </p>
    ),
  },
] satisfies { title: string; body: ReactNode }[]

export default function PrivacyPage() {
  return (
    <DocumentLayout eyebrow="Legal" title="Politique de confidentialité" intro={INTRO}>
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