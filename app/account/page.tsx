"use client"

import { useState } from "react"
import { DocumentLayout } from "@/components/shell/document-layout"

export default function AccountPage() {
  const [exportState, setExportState] = useState<"idle" | "requested">("idle")
  const [deleteStep, setDeleteStep] = useState<"idle" | "warning" | "confirmed">("idle")

  return (
    <DocumentLayout
      eyebrow="Compte"
      title="Votre compte"
      intro="Predicta n'a pas encore de comptes publics : la carte est libre d'accès, sans inscription. Cette page couvre les demandes que vous pourrez faire lorsqu'un compte sera disponible."
    >
      {/* Profil */}
      <section className="mb-10">
        <h2 className="text-[15px] font-semibold tracking-tight">Profil</h2>
        <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-foreground/80">
          Aucune session n'est connectée sur cet appareil. Les fonctionnalités
          de compte (profil, clés API, préférences synchronisées) seront
          annoncées prochainement.
        </p>
      </section>

      {/* Export */}
      <section id="export" className="mb-10 scroll-mt-24">
        <h2 className="text-[15px] font-semibold tracking-tight">Exporter vos données</h2>
        <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-foreground/80">
          Predicta ne stocke pas de données personnelles à ce jour. Une
          demande d'export couvrira vos préférences locales (thème,
          consentement cookies, historique de recherche sur cet appareil).
        </p>
        {exportState === "idle" ? (
          <button
            type="button"
            onClick={() => setExportState("requested")}
            className="mt-4 rounded-sm border border-border px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:border-foreground/40"
          >
            Demander l'export
          </button>
        ) : (
          <p className="animate-fade-in mt-4 text-[13.5px] text-primary">
            Export demandé. Vous serez notifié·e lorsque vos données seront
            prêtes.
          </p>
        )}
      </section>

      {/* Suppression */}
      <section id="delete" className="scroll-mt-24">
        <h2 className="text-[15px] font-semibold tracking-tight">Supprimer le compte</h2>

        {deleteStep === "idle" && (
          <>
            <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-foreground/80">
              Aucun compte n'est associé à cet appareil. Le flux ci-dessous
              illustre la procédure qui s'appliquera aux comptes.
            </p>
            <button
              type="button"
              onClick={() => setDeleteStep("warning")}
              className="mt-4 rounded-sm border border-[#e08a70]/50 px-4 py-2.5 text-[13.5px] font-medium text-[#e08a70] transition-colors hover:border-[#e08a70]"
            >
              Supprimer le compte
            </button>
          </>
        )}

        {deleteStep === "warning" && (
          <div className="animate-fade-in mt-4 max-w-2xl rounded-md border border-border/80 bg-black/20 p-5">
            <h3 className="text-[13.5px] font-semibold">Conséquences de la suppression</h3>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground/80">
              <li>Perte définitive de l'accès à votre profil et vos clés API.</li>
              <li>Suppression des données associées après la période légale de conservation.</li>
              <li>Aucune récupération possible une fois la demande traitée.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDeleteStep("confirmed")}
                className="rounded-sm bg-[#e08a70] px-4 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
              >
                Confirmer la suppression
              </button>
              <button
                type="button"
                onClick={() => setDeleteStep("idle")}
                className="rounded-sm px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {deleteStep === "confirmed" && (
          <p className="animate-fade-in mt-4 text-[13.5px] text-primary">
            Demande de suppression enregistrée. Vous serez notifié·e lorsque
            le traitement sera terminé.
          </p>
        )}
      </section>
    </DocumentLayout>
  )
}
