import { beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, currentUserMock, userMock, friendshipMock, sendPushToUserMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    currentUserMock: vi.fn(),
    userMock: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    friendshipMock: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    sendPushToUserMock: vi.fn(),
  }))

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
  currentUser: () => currentUserMock(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: userMock,
    friendship: friendshipMock,
  },
}))

vi.mock("@/lib/push/server", () => ({
  sendPushToUser: sendPushToUserMock,
  pushPayloadFromEntry: (entry: { id: string; title: string }) => ({
    id: entry.id,
    title: entry.title,
    url: "/friends",
  }),
}))

import {
  acceptFriendRequest,
  getMyProfile,
  listFriendRequests,
  listFriends,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
  setUsername,
} from "@/lib/actions/friends"

const me = {
  id: "user_requester",
  firstName: "dummy",
  lastName: "Rakoto",
  imageUrl: "https://example.com/avatar.png",
  primaryEmailAddress: { emailAddress: "dummy@example.com" },
}

beforeEach(() => {
  vi.clearAllMocks()
  authMock.mockResolvedValue({ userId: "user_requester" })
  currentUserMock.mockResolvedValue(me)
  userMock.findUnique.mockResolvedValue({
    id: "user_requester",
    username: null,
    firstName: "dummy",
    lastName: "Rakoto",
    profileImageUrl: null,
    email: "dummy@example.com",
  })
  friendshipMock.create.mockResolvedValue({ id: "friendship_1" })
})

describe("sendFriendRequest", () => {
  it("rejette quand l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(sendFriendRequest("user_target")).rejects.toThrow("connecté")
  })

  it("rejette un identifiant vide", async () => {
    await expect(sendFriendRequest("")).rejects.toThrow("manquant")
    await expect(sendFriendRequest("   ")).rejects.toThrow("manquant")
    expect(friendshipMock.create).not.toHaveBeenCalled()
  })

  it("refuse l'auto-demande", async () => {
    await expect(sendFriendRequest("user_requester")).rejects.toThrow("vous-même")
  })

  it("refuse si l'utilisateur cible n'existe pas", async () => {
    userMock.findUnique.mockResolvedValue(null)

    await expect(sendFriendRequest("user_ghost")).rejects.toThrow("n'existe pas")
    expect(userMock.findUnique).toHaveBeenCalledWith({
      where: { id: "user_ghost" },
      select: { id: true },
    })
  })

  it("refuse quand une demande ou une amitié existe déjà", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } }) =>
      args.where.id === "user_target" ? { id: "user_target" } : null
    )
    friendshipMock.findFirst.mockResolvedValue({ id: "friendship_1" })

    await expect(sendFriendRequest("user_target")).rejects.toThrow("déjà en cours")
    expect(friendshipMock.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ["pending", "accepted"] },
          OR: [
            { requesterId: "user_requester", addresseeId: "user_target" },
            { requesterId: "user_target", addresseeId: "user_requester" },
          ],
        }),
      })
    )
  })

  it("autorise la ré-émission après un refus (declined)", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } }) =>
      args.where.id === "user_target" ? { id: "user_target" } : null
    )
    friendshipMock.findFirst.mockResolvedValue(null)

    await sendFriendRequest("user_target")

    expect(friendshipMock.create).toHaveBeenCalledWith({
      data: {
        requesterId: "user_requester",
        addresseeId: "user_target",
        status: "pending",
      },
    })
  })

  it("crée la demande en statut pending", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } }) =>
      args.where.id === "user_target" ? { id: "user_target" } : null
    )
    friendshipMock.findFirst.mockResolvedValue(null)
    userMock.upsert.mockResolvedValue({ id: "user_requester" })

    await sendFriendRequest("user_target")

    expect(friendshipMock.create).toHaveBeenCalledWith({
      data: {
        requesterId: "user_requester",
        addresseeId: "user_target",
        status: "pending",
      },
    })
  })

  it("envoie un push d'invitation au destinataire", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } }) =>
      args.where.id === "user_target"
        ? { id: "user_target" }
        : args.where.id === "user_requester"
          ? {
              id: "user_requester",
              username: null,
              firstName: "dummy",
              lastName: "Rakoto",
              profileImageUrl: null,
            }
          : null
    )
    friendshipMock.findFirst.mockResolvedValue(null)
    friendshipMock.create.mockResolvedValue({ id: "friendship_7" })

    await sendFriendRequest("user_target")

    expect(userMock.findUnique).toHaveBeenCalledWith({
      where: { id: "user_requester" },
      select: expect.objectContaining({ username: true, firstName: true }),
    })
    expect(sendPushToUserMock).toHaveBeenCalledWith(
      "user_target",
      expect.objectContaining({
        id: "request:friendship_7",
        title: expect.stringContaining("dummy Rakoto"),
      })
    )
  })
})

describe("acceptFriendRequest", () => {
  it("n'accepte que les demandes destinées à l'utilisateur courant", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_autre",
      status: "pending",
    })

    await expect(acceptFriendRequest("friendship_1")).rejects.toThrow("introuvable")
    expect(friendshipMock.update).not.toHaveBeenCalled()
  })

  it("refuse une demande qui n'est plus en attente", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_requester",
      status: "accepted",
    })

    await expect(acceptFriendRequest("friendship_1")).rejects.toThrow("plus en attente")
    expect(friendshipMock.update).not.toHaveBeenCalled()
  })

  it("passe la demande en accepted", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      requesterId: "user_target",
      addresseeId: "user_requester",
      status: "pending",
    })

    await acceptFriendRequest("friendship_1")

    expect(friendshipMock.update).toHaveBeenCalledWith({
      where: { id: "friendship_1" },
      data: { status: "accepted" },
    })
    expect(sendPushToUserMock).toHaveBeenCalledWith(
      "user_target",
      expect.objectContaining({
        id: "accepted:friendship_1",
        title: expect.stringContaining("dummy Rakoto"),
      })
    )
  })
})

describe("rejectFriendRequest", () => {
  it("n'autorise que le destinataire de la demande", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_autre",
      status: "pending",
    })

    await expect(rejectFriendRequest("friendship_1")).rejects.toThrow("introuvable")
  })

  it("refuse de rejeter une demande déjà traitée", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_requester",
      status: "declined",
    })

    await expect(rejectFriendRequest("friendship_1")).rejects.toThrow("plus en attente")
  })

  it("passe la demande en declined", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_requester",
      status: "pending",
    })

    await rejectFriendRequest("friendship_1")

    expect(friendshipMock.update).toHaveBeenCalledWith({
      where: { id: "friendship_1" },
      data: { status: "declined" },
    })
  })
})

describe("removeFriend", () => {
  it("n'autorise que les deux membres de la relation", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      requesterId: "user_autre",
      addresseeId: "user_encore_autre",
      status: "accepted",
    })

    await expect(removeFriend("friendship_1")).rejects.toThrow("introuvable")
    expect(friendshipMock.delete).not.toHaveBeenCalled()
  })

  it("refuse de supprimer une relation non active", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      requesterId: "user_requester",
      addresseeId: "user_target",
      status: "pending",
    })

    await expect(removeFriend("friendship_1")).rejects.toThrow("pas active")
    expect(friendshipMock.delete).not.toHaveBeenCalled()
  })

  it("supprime une relation accepted", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      requesterId: "user_requester",
      addresseeId: "user_target",
      status: "accepted",
    })

    await removeFriend("friendship_1")

    expect(friendshipMock.delete).toHaveBeenCalledWith({ where: { id: "friendship_1" } })
  })
})

describe("listFriends", () => {
  it("ne renvoie que les amitiés accepted, avec l'autre utilisateur", async () => {
    friendshipMock.findMany.mockResolvedValue([
      {
        id: "friendship_1",
        createdAt: new Date("2026-09-01T10:00:00Z"),
        requester: { id: "user_requester", username: null, firstName: "dummy", lastName: "Rakoto", profileImageUrl: null },
        addressee: { id: "user_target", username: null, firstName: "Jean", lastName: "Ras", profileImageUrl: "https://example.com/j.png" },
      },
    ])

    const friends = await listFriends()

    expect(friends).toEqual([
      {
        friendshipId: "friendship_1",
        userId: "user_target",
        name: "Jean Ras",
        imageUrl: "https://example.com/j.png",
        since: new Date("2026-09-01T10:00:00Z"),
      },
    ])
    expect(friendshipMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "accepted",
          OR: [
            { requesterId: "user_requester" },
            { addresseeId: "user_requester" },
          ],
        }),
      })
    )
  })

  it("affiche le pseudo de l'ami quand il est défini", async () => {
    friendshipMock.findMany.mockResolvedValue([
      {
        id: "friendship_1",
        createdAt: new Date("2026-09-01T10:00:00Z"),
        requester: { id: "user_requester", username: null, firstName: "dummy", lastName: "Rakoto", profileImageUrl: null },
        addressee: { id: "user_target", username: "jeanr", firstName: "Jean", lastName: "Ras", profileImageUrl: null },
      },
    ])

    const friends = await listFriends()

    expect(friends[0].name).toBe("jeanr")
  })
})

describe("listFriendRequests", () => {
  it("ne renvoie que les demandes pending reçues", async () => {
    friendshipMock.findMany.mockResolvedValue([
      {
        id: "friendship_1",
        createdAt: new Date("2026-09-02T10:00:00Z"),
        requester: { id: "user_autre", username: null, firstName: "Lova", lastName: null, profileImageUrl: null },
      },
    ])

    const requests = await listFriendRequests()

    expect(requests).toEqual([
      {
        id: "friendship_1",
        fromUserId: "user_autre",
        fromName: "Lova",
        fromImageUrl: null,
        createdAt: new Date("2026-09-02T10:00:00Z"),
      },
    ])
    expect(friendshipMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { addresseeId: "user_requester", status: "pending" },
      })
    )
  })

  it("affiche le pseudo du demandeur quand il est défini", async () => {
    friendshipMock.findMany.mockResolvedValue([
      {
        id: "friendship_1",
        createdAt: new Date("2026-09-02T10:00:00Z"),
        requester: { id: "user_autre", username: "lovap", firstName: "Lova", lastName: null, profileImageUrl: null },
      },
    ])

    const requests = await listFriendRequests()

    expect(requests[0].fromName).toBe("lovap")
  })
})

describe("setUsername", () => {
  it("rejette quand l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(setUsername("yuta")).rejects.toThrow("connecté")
  })

  it.each(["ab", "x".repeat(21), "bad char!", "emoji😀"])(
    "rejette un pseudo invalide : %s",
    async (value) => {
      await expect(setUsername(value)).rejects.toThrow("Pseudo invalide")
      expect(userMock.update).not.toHaveBeenCalled()
    }
  )

  it.each(["a_b", "a-b", "a.b", "abc123", "zAz", "z".repeat(20)])(
    "accepte un pseudo valide : %s",
    async (value) => {
      userMock.findUnique.mockImplementation((args: { where: { id: string } | { username: string } }) =>
        "username" in args.where ? null : { id: "user_requester" }
      )

      await setUsername(value)

      expect(userMock.update).toHaveBeenCalledWith({
        where: { id: "user_requester" },
        data: { username: value },
      })
    }
  )

  it("nettoie les espaces avant de valider", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } | { username: string } }) =>
      "username" in args.where ? null : { id: "user_requester" }
    )

    await setUsername("  myName  ")

    expect(userMock.update).toHaveBeenCalledWith({
      where: { id: "user_requester" },
      data: { username: "myName" },
    })
  })

  it("refuse un pseudo déjà pris par un autre utilisateur", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } | { username: string } }) => {
      if ("username" in args.where) return { id: "user_autre" }
      return { id: "user_requester" }
    })

    await expect(setUsername("taken")).rejects.toThrow("déjà utilisé")
    expect(userMock.update).not.toHaveBeenCalled()
  })

  it("autorise à garder son propre pseudo (idem)", async () => {
    userMock.findUnique.mockImplementation((args: { where: { id: string } | { username: string } }) => {
      if ("username" in args.where) return { id: "user_requester" }
      return { id: "user_requester" }
    })

    await setUsername("yuta")

    expect(userMock.update).toHaveBeenCalledWith({
      where: { id: "user_requester" },
      data: { username: "yuta" },
    })
  })
})

describe("getMyProfile", () => {
  it("renvoie le profil local avec le pseudo", async () => {
    userMock.findUnique.mockResolvedValue({
      id: "user_requester",
      username: "yuta",
      firstName: "dummy",
      lastName: "Rakoto",
      email: "dummy@example.com",
      profileImageUrl: "https://example.com/avatar.png",
    })

    await expect(getMyProfile()).resolves.toEqual({
      id: "user_requester",
      username: "yuta",
      firstName: "dummy",
      lastName: "Rakoto",
      email: "dummy@example.com",
      profileImageUrl: "https://example.com/avatar.png",
    })
  })

  it("renvoie null si le profil local n'existe pas encore", async () => {
    userMock.findUnique.mockResolvedValue(null)

    await expect(getMyProfile()).resolves.toBeNull()
  })
})

describe("searchUsers", () => {
  it("renvoie [] pour une requête vide", async () => {
    await expect(searchUsers("")).resolves.toEqual([])
    await expect(searchUsers("   ")).resolves.toEqual([])
    expect(userMock.findMany).not.toHaveBeenCalled()
  })

  it("exclut toujours soi-même", async () => {
    userMock.findMany.mockResolvedValue([
      { id: "user_requester", username: null, firstName: "dummy", lastName: "Rakoto", profileImageUrl: null },
      { id: "user_target", username: null, firstName: "Jean", lastName: "Ras", profileImageUrl: null },
    ])

    const results = await searchUsers("Jean")

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("user_target")
    expect(friendshipMock.findMany).toHaveBeenCalled()
  })

  it("renvoie [] quand seul soi-même correspond", async () => {
    userMock.findMany.mockResolvedValue([
      { id: "user_requester", username: null, firstName: "dummy", lastName: "Rakoto", profileImageUrl: null },
    ])

    await expect(searchUsers("dummy")).resolves.toEqual([])
    expect(friendshipMock.findMany).not.toHaveBeenCalled()
  })

  it("exclut les utilisateurs avec qui une relation existe déjà", async () => {
    userMock.findMany.mockResolvedValue([
      { id: "user_target", username: null, firstName: "Jean", lastName: "Ras", profileImageUrl: null },
      { id: "user_prospect", username: null, firstName: "Lova", lastName: null, profileImageUrl: null },
    ])
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_requester", addresseeId: "user_target" },
    ])

    const results = await searchUsers("user")

    expect(results.map((r) => r.id)).toEqual(["user_prospect"])
  })

  it("retourne le pseudo et le nom d'affichage", async () => {
    userMock.findMany.mockResolvedValue([
      { id: "user_prospect", username: "lova_p", firstName: "Lova", lastName: null, profileImageUrl: "https://example.com/l.png" },
    ])
    friendshipMock.findMany.mockResolvedValue([])

    const results = await searchUsers("lova")

    expect(results).toEqual([
      {
        id: "user_prospect",
        username: "lova_p",
        name: "lova_p",
        imageUrl: "https://example.com/l.png",
      },
    ])
  })

  it("limite la recherche à 12 résultats", async () => {
    userMock.findMany.mockResolvedValue([])

    await searchUsers("a")

    expect(userMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 12 })
    )
  })
})