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

/** Demande d'ami sortante acceptée (notification). */
export interface AcceptedFriendRequest {
  id: string
  friendId: string
  friendName: string
  friendImageUrl: string | null
  /** Date à laquelle l'ami a accepté (updatedAt de la relation). */
  acceptedAt: Date
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

/** Position partagée par lien (page /share/[token]). */
export interface SharedLocation {
  sharerName: string
  sharerImageUrl: string | null
  latitude: number
  longitude: number
  accuracy: number | null
  updatedAt: Date
}

/** Profil local de l'utilisateur courant (page amis). */
export interface MyProfile {
  id: string
  username: string | null
  firstName: string | null
  lastName: string | null
  email: string | null
  profileImageUrl: string | null
}

/** Résultat de recherche d'utilisateurs par pseudo (formulaire ajout d'ami). */
export interface UserSearchResult {
  id: string
  username: string | null
  name: string
  imageUrl: string | null
}