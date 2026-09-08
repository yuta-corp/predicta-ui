"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddFriendFormProps {
  onSent: (addresseeId: string) => Promise<boolean>
}

export default function AddFriendForm({ onSent }: AddFriendFormProps) {
  const [addresseeId, setAddresseeId] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id = addresseeId.trim()
    if (!id) return

    setIsPending(true)
    try {
      const sent = await onSent(id)
      if (sent) setAddresseeId("")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <Input
        value={addresseeId}
        onChange={(event) => setAddresseeId(event.target.value)}
        placeholder="Identifiant Clerk (user_…)"
        aria-label="Identifiant de l'utilisateur à ajouter"
        className="max-w-sm"
      />
      <Button type="submit" disabled={isPending || !addresseeId.trim()}>
        {isPending ? "Envoi…" : "Envoyer la demande"}
      </Button>
    </form>
  )
}