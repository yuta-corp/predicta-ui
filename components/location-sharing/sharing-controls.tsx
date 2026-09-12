"use client"

import { Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { SHARE_INTERVAL_MS } from "@/lib/location-constants"
import type { SharingPhase } from "@/lib/store/location-sharing"
import type { Friend } from "@/lib/types/social"

/** Libellé d'état du partage (sous l'interrupteur). */
export function sharingStatusLabel(phase: SharingPhase): string {
  if (phase === "sharing") {
    return `En cours — mise à jour toutes les ${Math.round(SHARE_INTERVAL_MS / 1000)} s`
  }
  if (phase === "locating") return "Recherche de votre position…"
  return "Partage éteint"
}

interface SharingToggleProps {
  phase: SharingPhase
  isSharing: boolean
  toggling: boolean
  onToggle: (pressed: boolean) => void
}

/** Interrupteur principal du partage + état courant. */
export function SharingToggle({
  phase,
  isSharing,
  toggling,
  onToggle,
}: SharingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
      <div>
        <p className="flex items-center gap-1.5 text-[13px] font-medium">
          {phase === "locating" && (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          )}
          Partager ma position
        </p>
        <p className="text-xs text-muted-foreground">{sharingStatusLabel(phase)}</p>
      </div>
      <Switch
        checked={isSharing}
        aria-label="Partager ma position"
        aria-busy={phase === "locating" || toggling}
        onCheckedChange={onToggle}
        disabled={toggling}
      />
    </div>
  )
}

interface ViewerPickerProps {
  friends: Friend[]
  viewers: string[]
  onToggleViewer: (friendId: string, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
}

/** « Qui peut me voir ? » : un ami par ligne, plus un raccourci « tous ». */
export function ViewerPicker({
  friends,
  viewers,
  onToggleViewer,
  onToggleAll,
}: ViewerPickerProps) {
  if (friends.length === 0) {
    return (
      <p className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
        Vous n&apos;avez pas encore d&apos;ami accepté : ajoutez-en puis choisissez
        ceux qui pourront vous voir.
      </p>
    )
  }

  const allChecked = viewers.length === friends.length

  return (
    <div className="space-y-2">
      <p className="text-[13px] font-medium">Qui peut me voir ?</p>
      <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-muted">
        <Checkbox
          checked={allChecked}
          onCheckedChange={(checked) => onToggleAll(checked === true)}
        />
        Tous mes amis ({friends.length})
      </label>
      <div className="max-h-44 space-y-0.5 overflow-y-auto pr-1">
        {friends.map((friend) => (
          <label
            key={friend.userId}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-muted"
          >
            <Checkbox
              checked={viewers.includes(friend.userId)}
              onCheckedChange={(checked) =>
                onToggleViewer(friend.userId, checked === true)
              }
            />
            <Avatar size="sm" className="size-5">
              {friend.imageUrl ? (
                <AvatarImage src={friend.imageUrl} alt={friend.name} />
              ) : (
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <span className="truncate">{friend.name}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
