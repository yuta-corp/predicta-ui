"use client"

import { Copy, Link2, Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ShareLinkSectionProps {
  token: string | null
  loading: boolean
  onCreate: () => void
  onRevoke: () => void
}

/** URL de partage absolue dérivée du token (jamais d'accès à window au rendu serveur). */
function shareUrlFromToken(token: string | null): string {
  if (!token || typeof window === "undefined") return ""
  return new URL(`/share/${token}`, window.location.origin).toString()
}

/**
 * Lien de partage : création, copie, partage Facebook / Messenger, révocation.
 * Le lien reste protégé par l'authentification Predicta.
 */
export function ShareLinkSection({
  token,
  loading,
  onCreate,
  onRevoke,
}: ShareLinkSectionProps) {
  const shareUrl = shareUrlFromToken(token)
  const encoded = encodeURIComponent(shareUrl)
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
  const messengerUrl = `https://www.messenger.com/share?link=${encoded}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Lien copié")
    } catch {
      toast.error("Impossible de copier le lien.")
    }
  }

  return (
    <div className="space-y-2 border-t border-border pt-2">
      <p className="text-[13px] font-medium">Lien de partage</p>
      {token ? (
        <>
          <div className="flex gap-1.5">
            <Input readOnly value={shareUrl} className="font-mono text-[11.5px]" />
            <Button size="icon" variant="outline" onClick={copy} aria-label="Copier le lien">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button size="sm" variant="outline" asChild>
              <a href={facebookUrl} target="_blank" rel="noreferrer">
                <Share2 className="h-3.5 w-3.5" />
                Facebook
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={messengerUrl} target="_blank" rel="noreferrer">
                <Share2 className="h-3.5 w-3.5" />
                Messenger
              </a>
            </Button>
            <Button size="sm" variant="ghost" onClick={onRevoke}>
              Révoquer
            </Button>
          </div>
        </>
      ) : (
        <Button size="sm" variant="outline" onClick={onCreate} disabled={loading}>
          <Link2 className="h-3.5 w-3.5" />
          Créer un lien
        </Button>
      )}
      <p className="text-[11px] text-muted-foreground">
        Le lien est protégé : seul un utilisateur connecté à Predicta peut voir la
        position.
      </p>
    </div>
  )
}
