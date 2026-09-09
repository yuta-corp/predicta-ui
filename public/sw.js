/* Service worker Predicta — notifications push système.
 * - push : affiche une notification, sauf si un onglet Predicta a le focus
 *   (le toast SSE de l'application prend alors le relais, pas de doublon).
 * - notificationclick : met le client au premier plan et ouvre la cible.
 */
"use strict"

self.addEventListener("push", (event) => {
  let title = "Predicta"
  let body = ""
  let url = "/"
  let tag = "predicta"

  try {
    const data = event.data && event.data.json()
    if (data) {
      title = data.title || title
      body = data.body || ""
      url = data.url || url
      tag = data.id || tag
    }
  } catch (err) {
    console.error("[sw] push illisible :", err)
  }

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
      if (clients.some((client) => client.focused)) return

      await self.registration.showNotification(title, {
        body,
        icon: "/logo.png",
        badge: "/logo.png",
        tag,
        data: { url },
      })
    })()
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data && event.notification.data.url

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
      for (const client of clients) {
        if (!("focus" in client)) continue
        await client.focus()
        if (url && "navigate" in client && new URL(client.url).pathname !== url) {
          await client.navigate(url)
        }
        return
      }
      if (url || self.registration.scope) {
        await self.clients.openWindow(url || self.registration.scope)
      }
    })()
  )
})

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})