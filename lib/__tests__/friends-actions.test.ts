import { beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, currentUserMock, userMock, friendshipMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  currentUserMock: vi.fn(),
  userMock: {
    findUnique: vi.fn(),
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

import {
  acceptFriendRequest,
  listFriendRequests,
  listFriends,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/actions/friends"

beforeEach(() => {
  vi.clearAllMocks()
  authMock.mockResolvedValue({ userId: "user_requester" })
  currentUserMock.mockResolvedValue({
    id: "user_requester",
    firstName: "Mialy",
    lastName: "Rakoto",
    imageUrl: "https://example.com/avatar.png",
    primaryEmailAddress: { emailAddress: "mialy@example.com" },
  })
})

describe("sendFriendRequest", () => {
  it("rejette quand l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(sendFriendRequest("user_target")).rejects.toThrow("connecté")
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
    userMock.findUnique.mockResolvedValue({ id: "user_target" })
    friendshipMock.findFirst.mockResolvedValue({ id: "friendship_1" })

    await expect(sendFriendRequest("user_target")).rejects.toThrow("déjà en cours")
    expect(friendshipMock.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { requesterId: "user_requester", addresseeId: "user_target" },
            { requesterId: "user_target", addresseeId: "user_requester" },
          ],
        }),
      })
    )
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

  it("passe la demande en accepted", async () => {
    friendshipMock.findUnique.mockResolvedValue({
      id: "friendship_1",
      addresseeId: "user_requester",
      status: "pending",
    })

    await acceptFriendRequest("friendship_1")

    expect(friendshipMock.update).toHaveBeenCalledWith({
      where: { id: "friendship_1" },
      data: { status: "accepted" },
    })
  })
})

describe("rejectFriendRequest", () => {
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
        requester: { id: "user_requester", firstName: "Mialy", lastName: "Rakoto", profileImageUrl: null },
        addressee: { id: "user_target", firstName: "Jean", lastName: "Ras", profileImageUrl: "https://example.com/j.png" },
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
})

describe("listFriendRequests", () => {
  it("ne renvoie que les demandes pending reçues", async () => {
    friendshipMock.findMany.mockResolvedValue([
      {
        id: "friendship_1",
        createdAt: new Date("2026-09-02T10:00:00Z"),
        requester: { id: "user_autre", firstName: "Lova", lastName: null, profileImageUrl: null },
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
})