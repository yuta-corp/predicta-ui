"use client"

import { create } from "zustand"

/**
 * Demande de recentrage de la carte sur la position d'un ami.
 *
 * La carte vit dans le layout (`MapShell`) et n'est pas remontée quand on
 * navigue de `/map` vers `/map?friend=…` : un simple paramètre d'URL ne
 * suffirait pas à déclencher un recentrage. On passe donc par un état partagé :
 * la cloche (ou un lien profond) dépose la demande, la carte la consomme dès
 * qu'elle connaît la position de l'ami, puis la retire.
 *
 * `nonce` change à chaque demande : deux clics sur le même ami recentrent
 * bien deux fois (un état identique ne déclencherait aucun rendu).
 */
interface MapFocusState {
  /** Identifiant Clerk de l'ami à recentrer, ou null. */
  friendId: string | null
  /** Compteur monotone : chaque demande est un nouvel événement. */
  nonce: number
  /** Demande un recentrage sur la position de l'ami donné. */
  focusFriend: (friendId: string) => void
  /** Consomme la demande (appelée une fois le recentrage effectué). */
  clearFriendFocus: () => void
}

export const useMapFocusStore = create<MapFocusState>((set) => ({
  friendId: null,
  nonce: 0,
  focusFriend: (friendId) => {
    if (!friendId) return
    set((state) => ({ friendId, nonce: state.nonce + 1 }))
  },
  clearFriendFocus: () => {
    set((state) => (state.friendId === null ? state : { friendId: null }))
  },
}))
