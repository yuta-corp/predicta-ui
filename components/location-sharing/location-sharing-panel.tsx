"use client"

import { useCallback, useEffect, useState } from "react"
import { Copy, Link2, MapPin, Share2 } from "lucide-react"
import { toast } from "sonner"

import { useLocationSharing } from "@/components/location-sharing-provider"
import {
  createLocationLink,
  getMyLocationLink,
  getShareViewers,
  revokeLocationLink,
  setShareViewers,
} from "@/lib/actions/location"
import { listFriends } from "@/lib/actions/friends"
import type { Friend } from "@/lib/types/social"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface LocationSharingPanelProps {
  compact?: boolean
}

/**
 * Panneau de partage de position : interrupteur on/off, sélection des amis
 * autorisés à voir (ciblé ou « tous mes amis ») et partage par lien
 * (Protégé par l'auth Clerk ; partageable via Facebook / Messenger).
 */
export function LocationSharingPanel({ compact = false }: LocationSharingPanelProps) {
  const { isSharing, error, startSharing, stopSharing } = useLocationSharing()

  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [viewers, setViewers] = useState<string[]>([])
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  // (Re)charge les réglages du partage à chaque ouverture.
  useEffect(() => {
    if (!open) return
    let cancelled = false
    void (async () => {
      try {
        const [loadedFriends, loadedViewers, loadedLink] = await Promise.all([
          listFriends(),
          getShareViewers(),
          getMyLocationLink(),
        ])
        if (cancelled) return
        setFriends(loadedFriends)
        setViewers(loadedViewers)
        setLinkToken(loadedLink)
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Impossible de charger les réglages du partage."
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  const handleToggleSharing = async (pressed: boolean) => {
    setToggling(true)
    try {
      if (pressed) {
        const ok = await startSharing()
        if (ok) toast.success("Partage de position activé")
        else
          toast.error(
            "Impossible d'accéder à votre position. Autorisez la géolocalisation dans votre navigateur."
          )
      } else {
        const ok = await stopSharing()
        if (ok) toast.success("Partage de position désactivé")
        else toast.error("Impossible d'arrêter le partage pour le moment.")
      }
    } finally {
      setToggling(false)
    }
  }

  const persistViewers = useCallback(
    async (next: string[], prev: string[]) => {
      setViewers(next)
      try {
        await setShareViewers(next)
      } catch (err) {
        setViewers(prev)
        toast.error(
          err instanceof Error ? err.message : "Impossible d'enregistrer la sélection."
        )
      }
    },
    []
  )

  const toggleViewer = (friendId: string, checked: boolean) => {
    const next = checked
      ? [...viewers, friendId]
      : viewers.filter((id) => id !== friendId)
    void persistViewers(next, viewers)
  }

  const toggleAllViewers = (checked: boolean) => {
    const next = checked ? friends.map((friend) => friend.userId) : []
    void persistViewers(next, viewers)
  }

  const allChecked = friends.length > 0 && viewers.length === friends.length

  const shareUrl = linkToken
    ? new URL(`/share/${linkToken}`, window.location.origin).toString()
    : ""
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const messengerShareUrl = `https://www.messenger.com/share?link=${encodeURIComponent(shareUrl)}`

  const handleCreateLink = async () => {
    try {
      const token = await createLocationLink()
      setLinkToken(token)
      toast.success("Lien de partage créé")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de créer le lien.")
    }
  }

  const handleRevokeLink = async () => {
    if (!linkToken) return
    const token = linkToken
    try {
      await revokeLocationLink(token)
      setLinkToken(null)
      toast.success("Lien révoqué")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible de révoquer le lien.")
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Lien copié")
    } catch {
      toast.error("Impossible de copier le lien.")
    }
  }

  const triggerLabel = isSharing ? "Partage actif" : "Partager"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
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
              {triggerLabel}
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[340px]">
        <PopoverHeader>
          <PopoverTitle>Partage de position</PopoverTitle>
          <PopoverDescription>
            Vos amis voient votre position en temps réel sur la carte.
          </PopoverDescription>
        </PopoverHeader>

        {error && (
          <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
          <div>
            <p className="text-[13px] font-medium">Partager ma position</p>
            <p className="text-xs text-muted-foreground">
              {isSharing ? "En cours — mise à jour toutes les 30 s" : "Partage éteint"}
            </p>
          </div>
          <Switch
            checked={isSharing}
            onCheckedChange={(checked) => void handleToggleSharing(checked)}
            disabled={toggling}
          />
        </div>

        {friends.length === 0 ? (
          <p className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
            Vous n'avez pas encore d'ami accepté : ajoutez-en puis choisissez ceux qui
            pourront vous voir.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-[13px] font-medium">Qui peut me voir ?</p>
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-muted">
              <Checkbox
                checked={allChecked}
                onCheckedChange={(checked) => toggleAllViewers(checked === true)}
              />
              Tous mes amis ({friends.length})
            </label>
            <div className="max-h-44 space-y-0.5 overflow-y-auto pr-1">
              {friends.map((friend) => {
                const selected = viewers.includes(friend.userId)
                return (
                  <label
                    key={friend.userId}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] hover:bg-muted"
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(checked) => toggleViewer(friend.userId, checked === true)}
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
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 border-t border-border pt-2">
          <p className="text-[13px] font-medium">Lien de partage</p>
          {linkToken ? (
            <>
              <div className="flex gap-1.5">
                <Input readOnly value={shareUrl} className="font-mono text-[11.5px]" />
                <Button size="icon" variant="outline" onClick={handleCopy} aria-label="Copier le lien">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button size="sm" variant="outline" asChild>
                  <a href={fbShareUrl} target="_blank" rel="noreferrer">
                    <Share2 className="h-3.5 w-3.5" />
                    Facebook
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={messengerShareUrl} target="_blank" rel="noreferrer">
                    <Share2 className="h-3.5 w-3.5" />
                    Messenger
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={handleRevokeLink}>
                  Révoquer
                </Button>
              </div>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={handleCreateLink} disabled={loading}>
              <Link2 className="h-3.5 w-3.5" />
              Créer un lien
            </Button>
          )}
          <p className="text-[11px] text-muted-foreground">
            Le lien est protégé : seul un utilisateur connecté à Predicta peut voir la
            position.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}