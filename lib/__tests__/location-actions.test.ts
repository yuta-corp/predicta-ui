import { beforeEach, describe, expect, it, vi } from "vitest"

const { authMock, currentUserMock, userMock, friendshipMock, locationShareMock, locationShareViewerMock, locationShareLinkMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    currentUserMock: vi.fn(),
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
      findUnique: vi.fn(),
    },
    locationShareViewerMock: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    locationShareLinkMock: {
      findFirst: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
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
    locationShare: locationShareMock,
    locationShareViewer: locationShareViewerMock,
    locationShareLink: locationShareLinkMock,
    $transaction: (callback: (tx: unknown) => Promise<unknown>) =>
      callback({ locationShareViewer: locationShareViewerMock }),
  },
}))

import {
  createLocationLink,
  getFriendsLocations,
  getMyLocationLink,
  getSharedLocation,
  getShareViewers,
  revokeLocationLink,
  setShareViewers,
  stopLocationSharing,
  updateLocation,
} from "@/lib/actions/location"

const freshShare = {
  userId: "user_ami",
  latitude: -18.9,
  longitude: 47.5,
  accuracy: 8,
  updatedAt: new Date(),
  user: {
    username: "jeanr",
    firstName: "Jean",
    lastName: "Ras",
    profileImageUrl: "https://example.com/j.png",
  },
}

beforeEach(() => {
  vi.clearAllMocks()
  authMock.mockResolvedValue({ userId: "user_me" })
  currentUserMock.mockResolvedValue({
    id: "user_me",
    firstName: "dummy",
    lastName: "Rakoto",
    imageUrl: "https://example.com/m.png",
    primaryEmailAddress: { emailAddress: "dummy@example.com" },
  })
  userMock.findUnique.mockResolvedValue({ id: "user_me" })
})

describe("updateLocation", () => {
  it("rejette les coordonnées invalides", async () => {
    await expect(updateLocation(91, 0)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(-91, 0)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(0, 181)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(0, -181)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(Number.NaN, 0)).rejects.toThrow("Coordonnées invalides")
    await expect(updateLocation(0, Number.POSITIVE_INFINITY)).rejects.toThrow(
      "Coordonnées invalides"
    )
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

  it("conserve accuracy à 0 (valeur falsy)", async () => {
    await updateLocation(-18.8792, 47.5079, 0)

    expect(locationShareMock.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ accuracy: 0 }),
        update: expect.objectContaining({ accuracy: 0 }),
      })
    )
  })

  it("rejette l'écriture sans session", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(updateLocation(-18.8, 47.5)).rejects.toThrow("connecté")
  })

  it("crée l'utilisateur local s'il manque avant de publier", async () => {
    userMock.findUnique.mockResolvedValue(null)

    await updateLocation(-18.8, 47.5)

    expect(userMock.upsert).toHaveBeenCalled()
    expect(locationShareMock.upsert).toHaveBeenCalled()
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

describe("setShareViewers", () => {
  const acceptedRows = [{ requesterId: "user_me", addresseeId: "user_ami_a" }]

  it("ne garde que les ids d'amis acceptés (exclut étrangers et soi-même)", async () => {
    friendshipMock.findMany.mockResolvedValue(acceptedRows)

    await setShareViewers(["user_ami_a", "user_etranger", "user_me"])

    expect(locationShareViewerMock.deleteMany).toHaveBeenCalledWith({
      where: { shareUserId: "user_me" },
    })
    expect(locationShareViewerMock.createMany).toHaveBeenCalledWith({
      data: [{ shareUserId: "user_me", viewerUserId: "user_ami_a" }],
    })
  })

  it("dédoublonne les ids si l'UI en envoie en double", async () => {
    friendshipMock.findMany.mockResolvedValue(acceptedRows)

    await setShareViewers(["user_ami_a", "user_ami_a"])

    expect(locationShareViewerMock.createMany).toHaveBeenCalledWith({
      data: [{ shareUserId: "user_me", viewerUserId: "user_ami_a" }],
    })
  })

  it("vide la sélection quand aucun ami n'est autorisé", async () => {
    friendshipMock.findMany.mockResolvedValue([])

    await setShareViewers(["user_etranger"])

    expect(locationShareViewerMock.deleteMany).toHaveBeenCalledWith({
      where: { shareUserId: "user_me" },
    })
    expect(locationShareViewerMock.createMany).not.toHaveBeenCalled()
  })

  it("réécrit la sélection complète (pas d'accumulation)", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami_a" },
      { requesterId: "user_ami_b", addresseeId: "user_me" },
    ])

    await setShareViewers(["user_ami_a"])

    expect(locationShareViewerMock.deleteMany).toHaveBeenCalledTimes(1)
    expect(locationShareViewerMock.createMany).toHaveBeenCalledWith({
      data: [{ shareUserId: "user_me", viewerUserId: "user_ami_a" }],
    })
  })
})

describe("getShareViewers", () => {
  it("renvoie les ids des amis autorisés", async () => {
    locationShareViewerMock.findMany.mockResolvedValue([
      { viewerUserId: "user_ami_a" },
      { viewerUserId: "user_ami_b" },
    ])

    await expect(getShareViewers()).resolves.toEqual(["user_ami_a", "user_ami_b"])
    expect(locationShareViewerMock.findMany).toHaveBeenCalledWith({
      where: { shareUserId: "user_me" },
      select: { viewerUserId: true },
    })
  })

  it("renvoie une liste vide sans autorisation", async () => {
    locationShareViewerMock.findMany.mockResolvedValue([])

    await expect(getShareViewers()).resolves.toEqual([])
  })
})

describe("getFriendsLocations", () => {
  it("renvoie [] sans amis acceptés (aucune requête de viewers)", async () => {
    friendshipMock.findMany.mockResolvedValue([])

    await expect(getFriendsLocations()).resolves.toEqual([])
    expect(locationShareViewerMock.findMany).not.toHaveBeenCalled()
  })

  it("ne montre pas un ami qui ne m'a pas autorisé explicitement", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareViewerMock.findMany.mockResolvedValue([])

    await expect(getFriendsLocations()).resolves.toEqual([])
    expect(locationShareMock.findMany).not.toHaveBeenCalled()
  })

  it("renvoie les positions fraîches des amis autorisés", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
      { requesterId: "user_sans_autorisation", addresseeId: "user_me" },
    ])
    locationShareViewerMock.findMany.mockResolvedValue([
      { shareUserId: "user_ami" },
    ])
    locationShareMock.findMany.mockResolvedValue([freshShare])

    const locations = await getFriendsLocations()

    expect(locations).toEqual([
      {
        userId: "user_ami",
        name: "jeanr",
        imageUrl: "https://example.com/j.png",
        latitude: -18.9,
        longitude: 47.5,
        accuracy: 8,
        updatedAt: expect.any(Date),
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

  it("ne retourne que les amis à la fois amis et autorisés (intersection)", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareViewerMock.findMany.mockResolvedValue([
      { shareUserId: "user_ami" },
      { shareUserId: "user_ex_ami_refuse" },
    ])
    locationShareMock.findMany.mockResolvedValue([freshShare])

    const locations = await getFriendsLocations()

    expect(locations).toHaveLength(1)
    expect(locationShareMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: { in: ["user_ami"] } }) })
    )
  })

  it("exclut les positions périmées (TTL de 5 minutes)", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareViewerMock.findMany.mockResolvedValue([{ shareUserId: "user_ami" }])
    locationShareMock.findMany.mockResolvedValue([])

    const locations = await getFriendsLocations()

    expect(locations).toEqual([])
    const call = locationShareMock.findMany.mock.calls[0][0] as {
      where: { updatedAt: { gt: Date } }
    }
    expect(call.where.updatedAt.gt.getTime()).toBeLessThanOrEqual(Date.now())
    expect(call.where.updatedAt.gt.getTime()).toBeGreaterThan(Date.now() - 5 * 60_000 - 1_000)
  })

  it("renvoie une liste vide si aucun ami autorisé n'a partagé sa position", async () => {
    friendshipMock.findMany.mockResolvedValue([
      { requesterId: "user_me", addresseeId: "user_ami" },
    ])
    locationShareViewerMock.findMany.mockResolvedValue([{ shareUserId: "user_ami" }])
    locationShareMock.findMany.mockResolvedValue([])

    await expect(getFriendsLocations()).resolves.toEqual([])
  })
})

describe("createLocationLink", () => {
  it("réutilise le lien existant s'il y en a un", async () => {
    locationShareLinkMock.findFirst.mockResolvedValue({ token: "token_existant" })

    await expect(createLocationLink()).resolves.toBe("token_existant")
    expect(locationShareLinkMock.create).not.toHaveBeenCalled()
  })

  it("crée un lien avec un token hex de 48 caractères et 24 h d'expiration", async () => {
    locationShareLinkMock.findFirst.mockResolvedValue(null)
    const before = Date.now()

    const token = await createLocationLink()

    expect(token).toMatch(/^[0-9a-f]{48}$/)
    expect(locationShareLinkMock.create).toHaveBeenCalledTimes(1)
    const data = locationShareLinkMock.create.mock.calls[0][0].data as {
      token: string
      userId: string
      expiresAt: Date
    }
    expect(data.userId).toBe("user_me")
    expect(data.token).toBe(token)
    expect(data.expiresAt.getTime()).toBeGreaterThan(before + 23 * 60 * 60 * 1000)
    expect(data.expiresAt.getTime()).toBeLessThanOrEqual(before + 24 * 60 * 60 * 1000 + 1_000)
  })
})

describe("getMyLocationLink", () => {
  it("renvoie le token du lien courant", async () => {
    locationShareLinkMock.findFirst.mockResolvedValue({ token: "token_existant" })

    await expect(getMyLocationLink()).resolves.toBe("token_existant")
  })

  it("renvoie null sans lien", async () => {
    locationShareLinkMock.findFirst.mockResolvedValue(null)

    await expect(getMyLocationLink()).resolves.toBeNull()
  })
})

describe("revokeLocationLink", () => {
  it("ne fait rien sur un token vide", async () => {
    await revokeLocationLink("")

    expect(locationShareLinkMock.deleteMany).not.toHaveBeenCalled()
  })

  it("supprime uniquement le lien de l'utilisateur courant", async () => {
    await revokeLocationLink("token_a")

    expect(locationShareLinkMock.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user_me", token: "token_a" },
    })
  })
})

describe("getSharedLocation", () => {
  const validLink = {
    userId: "user_sharer",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    user: {
      username: "yuta",
      firstName: "Yuta",
      lastName: "R",
      profileImageUrl: "https://example.com/s.png",
    },
  }
  const validShare = {
    latitude: -18.87,
    longitude: 47.5,
    accuracy: 5,
    updatedAt: new Date(),
  }

  it("exige une session", async () => {
    authMock.mockResolvedValue({ userId: null })

    await expect(getSharedLocation("token")).rejects.toThrow("connecté")
  })

  it("renvoie null sur un token vide", async () => {
    await expect(getSharedLocation("")).resolves.toBeNull()
  })

  it("renvoie null si le lien n'existe pas", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue(null)

    await expect(getSharedLocation("inconnu")).resolves.toBeNull()
  })

  it("renvoie null si le lien a expiré", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue({
      ...validLink,
      expiresAt: new Date(Date.now() - 1_000),
    })

    await expect(getSharedLocation("token")).resolves.toBeNull()
  })

  it("renvoie null si le partage est arrêté", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue(validLink)
    locationShareMock.findUnique.mockResolvedValue(null)

    await expect(getSharedLocation("token")).resolves.toBeNull()
  })

  it("renvoie null si la position est périmée", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue(validLink)
    locationShareMock.findUnique.mockResolvedValue({
      ...validShare,
      updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    })

    await expect(getSharedLocation("token")).resolves.toBeNull()
  })

  it("renvoie la position avec les infos du partageur", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue(validLink)
    locationShareMock.findUnique.mockResolvedValue(validShare)

    await expect(getSharedLocation("token")).resolves.toEqual({
      sharerName: "yuta",
      sharerImageUrl: "https://example.com/s.png",
      latitude: -18.87,
      longitude: 47.5,
      accuracy: 5,
      updatedAt: expect.any(Date),
    })
  })

  it("recherche le lien par token", async () => {
    locationShareLinkMock.findUnique.mockResolvedValue(null)

    await getSharedLocation("mon-token")

    expect(locationShareLinkMock.findUnique).toHaveBeenCalledWith({
      where: { token: "mon-token" },
      select: {
        userId: true,
        expiresAt: true,
        user: { select: { id: true, username: true, firstName: true, lastName: true, profileImageUrl: true } },
      },
    })
  })
})