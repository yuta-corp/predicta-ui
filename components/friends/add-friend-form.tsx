"use client"

import { useEffect, useState } from "react"
import { Search, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchUsers } from "@/lib/actions/friends"
import type { UserSearchResult } from "@/lib/types/social"

interface AddFriendFormProps {
  onSent: (addresseeId: string) => Promise<boolean>
}

/**
 * Recherche différée (debounce 300 ms) par pseudo ou nom, pour ne pas marteler
 * l'API à chaque frappe.
 */
function useUserSearch(query: string) {
  const [results, setResults] = useState<UserSearchResult[]>([])

  useEffect(() => {
    const q = query.trim()
    let cancelled = false
    const timer = setTimeout(() => {
      void (async () => {
        if (q.length < 2) {
          if (!cancelled) setResults([])
          return
        }
        try {
          const found = await searchUsers(q)
          if (!cancelled) setResults(found)
        } catch (err) {
          if (!cancelled) {
            toast.error(err instanceof Error ? err.message : "Impossible de rechercher")
            setResults([])
          }
        }
      })()
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return { results, setResults }
}

/** Une ligne de résultat : identité, pseudo, bouton d'ajout. */
function SearchResultRow({
  user,
  pending,
  onAdd,
}: {
  user: UserSearchResult
  pending: boolean
  onAdd: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar size="sm">
          {user.imageUrl ? (
            <AvatarImage src={user.imageUrl} alt={user.name} />
          ) : (
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.username ? `@${user.username}` : "Utilisateur Predicta"}
          </p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={onAdd} disabled={pending}>
        <UserPlus className="h-3.5 w-3.5" />
        {pending ? "Envoi…" : "Ajouter"}
      </Button>
    </li>
  )
}

export default function AddFriendForm({ onSent }: AddFriendFormProps) {
  const [query, setQuery] = useState("")
  const { results, setResults } = useUserSearch(query)
  const [sendingTo, setSendingTo] = useState<string | null>(null)

  const handleAdd = async (user: UserSearchResult) => {
    setSendingTo(user.id)
    try {
      const sent = await onSent(user.id)
      if (sent) setResults((prev) => prev.filter((result) => result.id !== user.id))
    } finally {
      setSendingTo(null)
    }
  }

  const trimmed = query.trim()
  const tooShort = trimmed.length > 0 && trimmed.length < 2
  const noResult = trimmed.length >= 2 && results.length === 0

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pseudo ou nom, ex. « dummy »"
          aria-label="Rechercher un utilisateur par pseudo"
          className="pl-8"
        />
      </div>

      {tooShort && (
        <p className="text-xs text-muted-foreground">
          Tapez au moins 2 caractères pour lancer la recherche.
        </p>
      )}

      {results.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {results.map((user) => (
            <SearchResultRow
              key={user.id}
              user={user}
              pending={sendingTo === user.id}
              onAdd={() => void handleAdd(user)}
            />
          ))}
        </ul>
      )}

      {noResult && (
        <p className="text-sm text-muted-foreground">
          Aucun utilisateur trouvé pour «&nbsp;{trimmed}&nbsp;».
        </p>
      )}
    </div>
  )
}
