"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export interface Consent {
  essential: true
  analytics: boolean
  preferences: boolean
}

const STORAGE_KEY = "predicta-consent"
export const OPEN_CONSENT_EVENT = "predicta:open-consent"

export function loadConsent(): Consent | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Consent
    if (parsed && typeof parsed === "object" && parsed.essential === true) {
      return parsed
    }
  } catch {
    // stockage indisponible : on considère qu'aucun choix n'a été fait
  }
  return null
}

function saveConsent(consent: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  } catch {
    // stockage indisponible (navigation privée stricte) : silencieux
  }
}

interface PreferencesProps {
  preferences: boolean
  analytics: boolean
  onPreferences: (value: boolean) => void
  onAnalytics: (value: boolean) => void
}

/** Réglage fin des catégories de cookies (essentiels toujours actifs). */
function ConsentPreferences({
  preferences,
  analytics,
  onPreferences,
  onAnalytics,
}: PreferencesProps) {
  return (
    <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
      <label className="flex items-center justify-between gap-4">
        <span className="text-[13px]">
          Essentiels
          <span className="block text-[11px] text-muted-foreground">
            Toujours actifs — fonctionnement du site
          </span>
        </span>
        <Switch checked disabled aria-label="Cookies essentiels" />
      </label>
      <label className="flex items-center justify-between gap-4">
        <span className="text-[13px]">
          Préférences
          <span className="block text-[11px] text-muted-foreground">
            Thème, choix d&apos;affichage
          </span>
        </span>
        <Switch
          checked={preferences}
          onCheckedChange={onPreferences}
          aria-label="Cookies de préférences"
        />
      </label>
      <label className="flex items-center justify-between gap-4">
        <span className="text-[13px]">
          Mesure d&apos;audience
          <span className="block text-[11px] text-muted-foreground">
            Statistiques anonymes de visite
          </span>
        </span>
        <Switch
          checked={analytics}
          onCheckedChange={onAnalytics}
          aria-label="Cookies de mesure d'audience"
        />
      </label>
    </div>
  )
}

interface ActionsProps {
  customizing: boolean
  onAcceptAll: () => void
  onRejectNonEssential: () => void
  onCustomize: () => void
  onSave: () => void
  onBack: () => void
}

const PRIMARY_CLASS =
  "rounded-sm bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
const SECONDARY_CLASS =
  "rounded-sm border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/40"
const GHOST_CLASS =
  "rounded-sm px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"

/** Boutons : accepter tout, refuser, personnaliser (ou enregistrer / retour). */
function ConsentActions({
  customizing,
  onAcceptAll,
  onRejectNonEssential,
  onCustomize,
  onSave,
  onBack,
}: ActionsProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {customizing ? (
        <>
          <button type="button" onClick={onSave} className={PRIMARY_CLASS}>
            Enregistrer mes choix
          </button>
          <button type="button" onClick={onBack} className={cn(GHOST_CLASS)}>
            Retour
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={onAcceptAll} className={PRIMARY_CLASS}>
            Tout accepter
          </button>
          <button
            type="button"
            onClick={onRejectNonEssential}
            className={cn(SECONDARY_CLASS)}
          >
            Refuser les non essentiels
          </button>
          <button type="button" onClick={onCustomize} className={cn(GHOST_CLASS)}>
            Personnaliser
          </button>
        </>
      )}
    </div>
  )
}

interface ConsentDialogProps {
  customizing: boolean
  preferences: boolean
  analytics: boolean
  onPreferences: (value: boolean) => void
  onAnalytics: (value: boolean) => void
  onAcceptAll: () => void
  onRejectNonEssential: () => void
  onCustomize: () => void
  onSave: () => void
  onBack: () => void
}

/** Carte du bandeau : intro, réglage fin et actions. */
function ConsentDialog(props: ConsentDialogProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4"
      role="region"
      aria-label="Consentement cookies"
    >
      <div className="animate-rise w-full max-w-xl rounded-lg border border-border bg-background/95 p-5 shadow-[0_24px_64px_rgba(30,40,20,0.2)] backdrop-blur-md">
        <h2 className="text-[14.5px] font-semibold tracking-tight">Vos préférences</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Predicta utilise uniquement les cookies nécessaires au fonctionnement du
          site (préférences, thème). Aucun cookie de suivi ou publicitaire n&apos;est
          déposé.{" "}
          <Link
            href="/cookies"
            className="underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
          >
            En savoir plus
          </Link>
        </p>

        {props.customizing && (
          <ConsentPreferences
            preferences={props.preferences}
            analytics={props.analytics}
            onPreferences={props.onPreferences}
            onAnalytics={props.onAnalytics}
          />
        )}

        <ConsentActions
          customizing={props.customizing}
          onAcceptAll={props.onAcceptAll}
          onRejectNonEssential={props.onRejectNonEssential}
          onCustomize={props.onCustomize}
          onSave={props.onSave}
          onBack={props.onBack}
        />
      </div>
    </div>
  )
}

/** Bandeau de consentement cookies : uniquement des cookies nécessaires. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [preferences, setPreferences] = useState(true)

  useEffect(() => {
    // Déféré hors du corps d'effet (règle react-hooks) : la lecture du
    // consentement est locale, elle ne bloque pas la première peinture.
    const timer = window.setTimeout(() => {
      if (!loadConsent()) setVisible(true)
    }, 0)
    const onOpen = () => setVisible(true)
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen)
    }
  }, [])

  const close = (consent: Consent) => {
    saveConsent(consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <ConsentDialog
      customizing={customizing}
      preferences={preferences}
      analytics={analytics}
      onPreferences={setPreferences}
      onAnalytics={setAnalytics}
      onAcceptAll={() => close({ essential: true, analytics: true, preferences: true })}
      onRejectNonEssential={() =>
        close({ essential: true, analytics: false, preferences: false })
      }
      onCustomize={() => setCustomizing(true)}
      onSave={() => close({ essential: true, analytics, preferences })}
      onBack={() => setCustomizing(false)}
    />
  )
}
