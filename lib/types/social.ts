export interface Friend {
  friendshipId: string
  userId: string
  name: string
  imageUrl: string | null
  since: Date
}

export interface FriendRequest {
  id: string
  fromUserId: string
  fromName: string
  fromImageUrl: string | null
  createdAt: Date
}

export interface FriendLocation {
  userId: string
  name: string
  imageUrl: string | null
  latitude: number
  longitude: number
  accuracy: number | null
  updatedAt: Date
}