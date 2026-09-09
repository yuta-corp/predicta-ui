import { beforeEach, describe, expect, it, vi } from "vitest"

const { webPushMock, pushSubscriptionMock } = vi.hoisted(() => ({
  webPushMock: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
    WebPushError: class WebPushError extends Error {
      constructor(
        message: string,
        public statusCode: number,
        public body?: string,
        public headers: Record<string, string> = {}
      ) {
        super(message)
        this.name = "WebPushError"
      }
    },
  },
  pushSubscriptionMock: {
    upsert: vi.fn(),
    findMany: vi.fn<
      () => Promise<Array<{ endpoint: string; auth: string; p256dh: string }>>
    >(),
    deleteMany: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock("web-push", () => ({ default: webPushMock }))

vi.mock("@/lib/push/vapid", () => ({
  pushConfigured: true,
  PUSH_TTL_SECONDS: 120,
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pushSubscription: pushSubscriptionMock,
  },
}))

import {
  removePushSubscription,
  savePushSubscription,
  sendPushToUser,
} from "@/lib/push/server"
import type { NotificationEntry } from "@/lib/notifications/events"

const entry: NotificationEntry = {
  id: "request:f1",
  kind: "request",
  title: "Jean vous a envoyé une demande d'ami.",
}

beforeEach(() => {
  vi.clearAllMocks()
  pushSubscriptionMock.findMany.mockResolvedValue([])
})

describe("savePushSubscription", () => {
  it("insère ou met à jour l'abonnement par endpoint", async () => {
    await savePushSubscription("user_1", {
      endpoint: "https://push.example.com/a",
      keys: { auth: "auth1", p256dh: "p256dh1" },
    })

    expect(pushSubscriptionMock.upsert).toHaveBeenCalledWith({
      where: { endpoint: "https://push.example.com/a" },
      create: {
        userId: "user_1",
        endpoint: "https://push.example.com/a",
        auth: "auth1",
        p256dh: "p256dh1",
      },
      update: {
        userId: "user_1",
        auth: "auth1",
        p256dh: "p256dh1",
      },
    })
  })
})

describe("removePushSubscription", () => {
  it("supprime uniquement l'abonnement de l'utilisateur", async () => {
    await removePushSubscription("user_1", "https://push.example.com/a")

    expect(pushSubscriptionMock.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user_1", endpoint: "https://push.example.com/a" },
    })
  })
})

describe("sendPushToUser", () => {
  it("ne fait rien sans abonnement", async () => {
    await sendPushToUser("user_1", { id: entry.id, title: entry.title, url: "/friends" })

    expect(webPushMock.sendNotification).not.toHaveBeenCalled()
  })

  it("envoie à tous les appareils de l'utilisateur", async () => {
    pushSubscriptionMock.findMany.mockResolvedValue([
      { endpoint: "https://push.example.com/a", auth: "auth1", p256dh: "k1" },
      { endpoint: "https://push.example.com/b", auth: "auth2", p256dh: "k2" },
    ])
    webPushMock.sendNotification.mockResolvedValue(undefined)

    await sendPushToUser("user_1", { id: entry.id, title: entry.title, url: "/friends" })

    expect(webPushMock.sendNotification).toHaveBeenCalledTimes(2)
    expect(webPushMock.sendNotification).toHaveBeenCalledWith(
      { endpoint: "https://push.example.com/a", keys: { auth: "auth1", p256dh: "k1" } },
      JSON.stringify({ id: entry.id, title: entry.title, url: "/friends" }),
      { TTL: 120 }
    )
    expect(pushSubscriptionMock.deleteMany).not.toHaveBeenCalled()
  })

  it("nettoie les endpoints périmés (404/410) sans faire échouer l'envoi", async () => {
    pushSubscriptionMock.findMany.mockResolvedValue([
      { endpoint: "https://push.example.com/mort", auth: "a", p256dh: "k" },
      { endpoint: "https://push.example.com/vivant", auth: "b", p256dh: "k" },
    ])
    webPushMock.sendNotification.mockImplementation(
      async (sub: { endpoint: string }) => {
        if (sub.endpoint.endsWith("/mort")) {
          throw new webPushMock.WebPushError("gone", 410)
        }
      }
    )

    await expect(
      sendPushToUser("user_1", { id: entry.id, title: entry.title, url: "/friends" })
    ).resolves.toBeUndefined()

    expect(pushSubscriptionMock.deleteMany).toHaveBeenCalledWith({
      where: { endpoint: { in: ["https://push.example.com/mort"] } },
    })
  })
})