"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMyProfile, setUsername } from "@/lib/actions/friends"
import type { MyProfile } from "@/lib/types/social"

const PSEUDO_PATTERN = /^[a-zA-Z0-9._-]{3,20}$/

interface PseudoEditor {
  value: string
  setValue: (value: string) => void
  loading: boolean
  isPending: boolean
  trimmed: string
  dirty: boolean
  valid: boolean
  save: () => Promise<void>
}

/** Charge le profil, valide le pseudo et l'enregistre. */
function usePseudoEditor(): PseudoEditor {
  const [profile, setProfile] = useState<MyProfile | null>(null)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const loaded = await getMyProfile()
        if (cancelled || !loaded) return
        setProfile(loaded)
        setValue(loaded.username ?? "")
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Impossible de charger votre profil"
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const trimmed = value.trim()
  const dirty = trimmed !== (profile?.username ?? "")
  const valid = PSEUDO_PATTERN.test(trimmed)

  const save = async () => {
    if (!valid || !dirty) return
    setIsPending(true)
    try {
      await setUsername(trimmed)
      setProfile((prev) => (prev ? { ...prev, username: trimmed } : prev))
      toast.success("Pseudo enregistré")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'enregistrer le pseudo"
      )
    } finally {
      setIsPending(false)
    }
  }

  return { value, setValue, loading, isPending, trimmed, dirty, valid, save }
}

/** Champ pseudo + bouton d'enregistrement. */
function PseudoField({ editor }: { editor: PseudoEditor }) {
  const { value, setValue, isPending, trimmed, dirty, valid, save } = editor
  const invalid = !valid && trimmed.length > 0
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-[220px] flex-1 space-y-1.5">
        <Label htmlFor="pseudo">Pseudo</Label>
        <Input
          id="pseudo"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="ex. dummy_tana"
          maxLength={20}
          aria-invalid={invalid || undefined}
        />
        <p className={`text-xs ${invalid ? "text-destructive" : "text-muted-foreground"}`}>
          {trimmed.length}/20 — lettres, chiffres, . _ et - uniquement (3 à 20
          caractères). Utilisé pour vos amis et la recherche.
        </p>
      </div>
      <Button type="button" onClick={save} disabled={!valid || !dirty || isPending}>
        {isPending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </div>
  )
}

export function PseudoForm() {
  const editor = usePseudoEditor()

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Mon pseudo</h2>
      {editor.loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <PseudoField editor={editor} />
      )}
    </section>
  )
}
