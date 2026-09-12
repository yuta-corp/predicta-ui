"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import {
  acceptFriendRequest,
  listFriendRequests,
  listFriends,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/actions/friends"
import type { Friend, FriendRequest } from "@/lib/types/social"

/** Charge amis + demandes, keyés par utilisateur. */
function useFriendsData() {
  const { user } = useUser()
  const [friends, setFriends] = useState<Friend[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const [friendsData, requestsData] = await Promise.all([
      listFriends(),
      listFriendRequests(),
    ])
    return { friends: friendsData, requests: requestsData }
  }, [])

  useEffect(() => {
    const userId = user?.id
    if (!userId) return

    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchData()
        if (cancelled) return
        setFriends(data.friends)
        setRequests(data.requests)
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Impossible de charger vos amis."
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user?.id, fetchData])

  return { friends, requests, isLoading, error, setFriends, setRequests, fetchData }
}

/** Amis, demandes, et actions qui rechargent l'état après coup. */
export function useFriends() {
  const { friends, requests, isLoading, error, setFriends, setRequests, fetchData } =
    useFriendsData()

  const sendRequest = useCallback(
    async (addresseeId: string) => {
      await sendFriendRequest(addresseeId)
      setFriends((await fetchData()).friends)
    },
    [fetchData, setFriends]
  )

  const acceptRequest = useCallback(
    async (requestId: string) => {
      await acceptFriendRequest(requestId)
      const data = await fetchData()
      setFriends(data.friends)
      setRequests(data.requests)
    },
    [fetchData, setFriends, setRequests]
  )

  const rejectRequest = useCallback(
    async (requestId: string) => {
      await rejectFriendRequest(requestId)
      setRequests((await fetchData()).requests)
    },
    [fetchData, setRequests]
  )

  const removeFriendFn = useCallback(
    async (friendshipId: string) => {
      await removeFriend(friendshipId)
      setFriends((await fetchData()).friends)
    },
    [fetchData, setFriends]
  )

  return {
    friends,
    requests,
    isLoading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend: removeFriendFn,
  }
}
