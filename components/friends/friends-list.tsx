"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Friend } from "@/lib/types/social"

interface FriendsListProps {
  friends: Friend[]
  onRemove: (friendshipId: string) => Promise<void>
  isPending?: boolean
}

export default function FriendsList({
  friends,
  onRemove,
  isPending = false,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aucun ami pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {friends.map((friend) => (
        <li
          key={friend.friendshipId}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Avatar>
            {friend.imageUrl ? (
              <AvatarImage src={friend.imageUrl} alt={friend.name} />
            ) : (
              <AvatarFallback>{friend.name[0]}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{friend.name}</p>
            <p className="text-sm text-muted-foreground">
              Amis depuis le {friend.since.toLocaleDateString("fr-FR")}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => void onRemove(friend.friendshipId)}
          >
            Retirer
          </Button>
        </li>
      ))}
    </ul>
  )
}