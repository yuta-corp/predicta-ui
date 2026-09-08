"use client"

import { useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

import AddFriendForm from "@/components/friends/add-friend-form"
import FriendRequestList from "@/components/friends/friend-request-list"
import FriendsList from "@/components/friends/friends-list"
import { PseudoForm } from "@/components/friends/pseudo-form"
import { useFriends } from "@/hooks/use-friends"

export function FriendsManager() {
  const { isLoaded } = useUser()
  const {
    friends,
    requests,
    isLoading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
  } = useFriends()

  const handleSend = useCallback(
    async (addresseeId: string): Promise<boolean> => {
      try {
        await sendRequest(addresseeId)
        toast.success("Demande d'ami envoyée")
        return true
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible d'envoyer la demande")
        return false
      }
    },
    [sendRequest]
  )

  const handleAccept = useCallback(
    async (requestId: string) => {
      try {
        await acceptRequest(requestId)
        toast.success("Demande acceptée")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible d'accepter la demande")
      }
    },
    [acceptRequest]
  )

  const handleReject = useCallback(
    async (requestId: string) => {
      try {
        await rejectRequest(requestId)
        toast.success("Demande refusée")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible de refuser la demande")
      }
    },
    [rejectRequest]
  )

  const handleRemove = useCallback(
    async (friendshipId: string) => {
      try {
        await removeFriend(friendshipId)
        toast.success("Ami retiré")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible de retirer cet ami")
      }
    },
    [removeFriend]
  )

  if (!isLoaded || isLoading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
  }

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <PseudoForm />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Demandes reçues</h2>
        <FriendRequestList requests={requests} onAccept={handleAccept} onReject={handleReject} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Mes amis ({friends.length})</h2>
        <FriendsList friends={friends} onRemove={handleRemove} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ajouter un ami</h2>
        <p className="text-sm text-muted-foreground">
          Cherchez par pseudo (ou nom) puis envoyez une demande d'ami.
        </p>
        <AddFriendForm onSent={handleSend} />
      </section>
    </div>
  )
}