"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { toast } from "sonner"

import { useLocationSharing } from "@/components/location-sharing-provider"
import { ShareLinkSection } from "@/components/location-sharing/share-link-section"
import {
  SharingToggle,
  ViewerPicker,
} from "@/components/location-sharing/sharing-controls"
import {
  useSharingSettings,
  type SharingSettings,
} from "@/components/location-sharing/use-sharing-settings"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  useLocationSharingStore,
  type SharingPhase,
} from "@/lib/store/location-sharing"
import { cn } from "@/lib/utils"

interface LocationSharingPanelProps {
  compact?: boolean
}

interface SharingTriggerProps {
  compact: boolean
  isSharing: boolean
  open: boolean
}

function SharingTrigger({ compact, isSharing, open }: SharingTriggerProps) {
  const label = isSharing ? "Partage actif" : "Partager"
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "inline-flex shrink-0 items-center rounded-full text-[13px] font-medium transition-colors",
          compact
            ? "h-7 w-7 justify-center hover:bg-foreground/5"
            : "gap-1.5 rounded-sm px-2 py-1.5 hover:text-foreground",
          isSharing ? "text-primary" : "text-foreground"
        )}
      >
        {compact ? (
          <MapPin className="h-4 w-4" aria-hidden />
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {label}
          </>
        )}
      </button>
    </PopoverTrigger>
  )
}

interface SharingPanelContentProps {
  error: string | null
  phase: SharingPhase
  isSharing: boolean
  toggling: boolean
  onToggle: (pressed: boolean) => void
  settings: SharingSettings
}

/** Contenu du popover : titre, erreur, interrupteur, audience, lien. */
function SharingPanelContent({
  error,
  phase,
  isSharing,
  toggling,
  onToggle,
  settings,
}: SharingPanelContentProps) {
  return (
    <PopoverContent align="end" className="w-[340px]">
      <PopoverHeader>
        <PopoverTitle>Partage de position</PopoverTitle>
        <PopoverDescription>
          Vos amis voient votre position en temps réel sur la carte.
        </PopoverDescription>
      </PopoverHeader>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs text-destructive"
        >
          {error}
        </p>
      )}

      <SharingToggle
        phase={phase}
        isSharing={isSharing}
        toggling={toggling}
        onToggle={onToggle}
      />

      <ViewerPicker
        friends={settings.friends}
        viewers={settings.viewers}
        onToggleViewer={settings.toggleViewer}
        onToggleAll={settings.toggleAllViewers}
      />

      <ShareLinkSection
        token={settings.linkToken}
        loading={settings.loading}
        onCreate={() => void settings.createLink()}
        onRevoke={() => void settings.revokeLink()}
      />
    </PopoverContent>
  )
}

/**
 * Panneau de partage de position : interrupteur on/off, sélection des amis
 * autorisés à voir (ciblé ou « tous mes amis ») et partage par lien.
 */
export function LocationSharingPanel({ compact = false }: LocationSharingPanelProps) {
  const { isSharing, phase, error, startSharing, stopSharing } = useLocationSharing()
  const [open, setOpen] = useState(false)
  const [toggling, setToggling] = useState(false)
  const settings = useSharingSettings(open)

  const handleToggleSharing = async (pressed: boolean) => {
    setToggling(true)
    try {
      const ok = pressed ? await startSharing() : await stopSharing()
      if (ok) {
        toast.success(
          pressed ? "Partage de position activé" : "Partage de position désactivé"
        )
        return
      }
      // L'erreur précise est posée par la session de partage (permission,
      // réseau…) : on relaie ce message plutôt qu'un texte générique.
      toast.error(
        useLocationSharingStore.getState().error ??
          "Le partage de position n'a pas pu être modifié."
      )
    } finally {
      setToggling(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <SharingTrigger compact={compact} isSharing={isSharing} open={open} />
      <SharingPanelContent
        error={error}
        phase={phase}
        isSharing={isSharing}
        toggling={toggling}
        onToggle={(checked) => void handleToggleSharing(checked)}
        settings={settings}
      />
    </Popover>
  )
}
