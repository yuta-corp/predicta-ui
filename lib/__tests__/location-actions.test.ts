import { beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, userMock, friendshipMock, locationShareMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  userMock: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  friendshipMock: {
    findMany: vi.fn(),
  },
  locationShareMock: {
    upsert: vi.fn(),
    deleteMany: vi.fn(),
    findMany: vi.fn(),
  },
}))

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => authMock(),
  currentUser: () => vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: userMock,
    friendship: friendshipMock,
    locationShare: locationShareMock,
  },
}))

import {
  getFriendsLocations,
  stopLocationSharing,
  updateLocation,
} from "@/lib/actions/location"

beforeEach(() => {
  vi.clearAllMocks()
  authMock.mockResolvedValue({ userId: "user_me" })
  userMock.findUnique.mockResolvedValue({ id: "user_me" })
})

describe("updateLocation", () => {
  it("rejette les coordonnées invalides", async () => {
    await expect(updateLocation(91, 0)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(-91, 0)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(0, 181)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(Number.NaN, 0)).rejects.toThrow("Coordonnées invalides")
    expect(locationShareMock.upsert).not.toHaveBeenCalled()
  })

  it("fait un upsert de la position (création)", async () => {
    await updateLocation(-18.8792, 47.5079, 12)

    expect(locationShareMock.upsert).toHaveBeenCalledWith({
      where: { userId: "user_me" },
      create: {
        userId: "user_me",
        latitude: -18.8792,
        longitude: 47.5079,
        accuracy: 12,
      },
      update: {
        latitude: -18.8792,
        longitude: 47.5079,
        accuracy: 12,
      },
    })
  })

  it("met à jour sans précision quand accuracy est absente", async () => {
    await updateLocation(-18.8792, 47.5079)

    expect(locationShareMock.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ accuracy: null }),
        update: expect.objectContaining({ accuracy: null }),
      })
    )
  })
})

describe("stopLocationSharing", () => {
  it("supprime la position de l'utilisateur courant", async () => {
    await stopLocationSharing()

    expect(locationShareMock.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user_me" },
    })
  })
})

describe("getFriendsLocations", () => {
  it("renvoie [] sans amis", async () => {
    friendshipMock.findMany.mockResolvedValue([])

    await expect(getFriendsLocations()).resolves.toEqual([])
  })

  it("ne renvoie que les positions fraîches des amis acceptés", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareMock.findMany.mockResolvedValue([
      {
        userId: "user_ami",
        latitude: -18.9,
        longitude: 47.5,
        accuracy: 8,
        updatedAt: new Date("2026-09-03T08:00:00Z"),
        user: {
          firstName: "Jean",
          lastName: "Ras",
          profileImageUrl: null,
        },
      },
    ])

    const locations = await getFriendsLocations()

    expect(locations).toEqual([
      {
        userId: "user_ami",
        name: "Jean Ras",
        imageUrl: null,
        latitude: -18.9,
        longitude: 47.5,
        accuracy: 8,
        updatedAt: new Date("2026-09-03T08:00:00Z"),
      },
    ])
    expect(locationShareMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: { in: ["user_ami"] },
          updatedAt: expect.objectContaining({ gt: expect.any(Date) }),
        }),
      })
    )
  })

  it("exclut les positions périmées (updatedAt trop ancien)", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareMock.findMany.mockResolvedValue([])

    const locations = await getFriendsLocations()

    expect(locations).toEqual([])
    const call = locationShareMock.findMany.mock.calls[0][0] as {
      where: { updatedAt: { gt: Date } }
    }
    expect(call.where.updatedAt.gt.getTime()).toBeLessThanOrEqual(Date.now())
    expect(call.where.updatedAt.gt.getTime()).toBeGreaterThan(
      Date.now() - 5 * 60_000 - 1_000
    )
  })
})