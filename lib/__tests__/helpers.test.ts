import { beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, currentUserMock, userMock, friendshipMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  currentUserMock: vi.fn(),
  userMock: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  friendshipMock: {
    findMany: vi.fn(),
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
  displayName,
  ensureLocalUser,
  getAcceptedFriendIds,
  requireUserId,
} from "@/lib/actions/helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("requireUserId", () => {
  it("renvoie l'identifiant de la session", async () => {
    authMock.mockResolvedValue({ userId: "user_me" })

    await expect(requireUserId()).resolves.toBe("user_me")
  })

  it("lève une erreur sans session", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(requireUserId()).rejects.toThrow("connecté")
  })
})

describe("displayName", () => {
  it("préfère le pseudo quand il est défini", () => {
    expect(
      displayName({
        username: "yuta",
        firstName: "Mialy",
        lastName: "Rakoto",
      })
    ).toBe("yuta")
  })

  it("retombe sur nom + prénom sans pseudo", () => {
    expect(
      displayName({ username: null, firstName: "Mialy", lastName: "Rakoto" })
    ).toBe("Mialy Rakoto")
  })

  it("gère un nom de famille absent", () => {
    expect(displayName({ username: null, firstName: "Lova", lastName: null })).toBe("Lova")
  })

  it("replie sur « Utilisateur » quand tout est vide", () => {
    expect(displayName({ username: null, firstName: null, lastName: null })).toBe("Utilisateur")
  })
})

describe("getAcceptedFriendIds", () => {
  it("renvoie l'ami quand je suis le demandeur", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])

    await expect(getAcceptedFriendIds("user_me")).resolves.toEqual(["user_ami"])
  })

  it("renvoie l'ami quand je suis le destinataire", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_ami", addresseeId: "user_me" },
    ])

    await expect(getAcceptedFriendIds("user_me")).resolves.toEqual(["user_ami"])
  })

  it("fusionne les deux sens", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_a" },
      { requesterId: "user_b", addresseeId: "user_me" },
    ])

    await expect(getAcceptedFriendIds("user_me")).resolves.toEqual(["user_a", "user_b"])
  })

  it("renvoie une liste vide sans amitiés", async () => {
    friendshipMock.findMany.mockResolvedValue([])

    await expect(getAcceptedFriendIds("user_me")).resolves.toEqual([])
  })

  it("ne filtre que les liens accepted, dans les deux sens", async () => {
    friendshipMock.findMany.mockResolvedValue([])

    await getAcceptedFriendIds("user_me")

    expect(friendshipMock.findMany).toHaveBeenCalledWith({
      where: {
        status: "accepted",
        OR: [{ requesterId: "user_me" }, { addresseeId: "user_me" }],
      },
      select: { requesterId: true, addresseeId: true },
    })
  })
})

describe("ensureLocalUser", () => {
  it("ne fait rien si l'utilisateur existe déjà localement", async () => {
    userMock.findUnique.mockResolvedValue({ id: "user_me" })

    await ensureLocalUser("user_me")

    expect(userMock.findUnique).toHaveBeenCalledWith({
      where: { id: "user_me" },
      select: { id: true },
    })
    expect(currentUserMock).not.toHaveBeenCalled()
    expect(userMock.upsert).not.toHaveBeenCalled()
  })

  it("crée l'utilisateur local depuis Clerk s'il manque", async () => {
    userMock.findUnique.mockResolvedValue(null)
    currentUserMock.mockResolvedValue({
      id: "user_me",
      firstName: "Mialy",
      lastName: "Rakoto",
      imageUrl: "https://example.com/a.png",
      primaryEmailAddress: { emailAddress: "mialy@example.com" },
    })

    await ensureLocalUser("user_me")

    expect(userMock.upsert).toHaveBeenCalledWith({
      where: { id: "user_me" },
      create: {
        id: "user_me",
        email: "mialy@example.com",
        firstName: "Mialy",
        lastName: "Rakoto",
        profileImageUrl: "https://example.com/a.png",
      },
      update: {},
    })
  })

  it("ne fait rien si Clerk ne renvoie pas d'utilisateur", async () => {
    userMock.findUnique.mockResolvedValue(null)
    currentUserMock.mockResolvedValue(null)

    await ensureLocalUser("user_me")

    expect(userMock.upsert).not.toHaveBeenCalled()
  })
})