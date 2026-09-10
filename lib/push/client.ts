/**
 * Web Push côté client : inscription du service worker, abonnement et
 * révocation. Façade purement navigateur — aucune dépendance serveur —
 * utilisée par le composant d'opt-in.
 */

export type PushPermissionState = "unsupported" | "idle" | "granted" | "denied"

export const SW_PATH = "/sw.js"

/** Le navigateur sait-il gérer les notifications push ? */
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

/** Convertit une clé Application Server en Uint8Array (attendu par subscribe). */
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  const base64Url = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64Url)
  const bytes = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i)
  return bytes
}

/** État actuel de la permission (idle = jamais demandée). */
export function getPushPermissionState(): PushPermissionState {
  if (!isPushSupported()) return "unsupported"
  return Notification.permission === "default" ? "idle" : Notification.permission
}

/** Enregistre le service worker (nécessaire pour recevoir les push). */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.register(SW_PATH)
}

/**
 * Active les notifications push : demande la permission (à appeler depuis
 * un geste utilisateur), s'abonne au service push et enregistre
 * l'abonnement sur le serveur. Renvoie l'état final.
 */
export async function enablePushNotifications(): Promise<PushPermissionState> {
  if (!isPushSupported()) return "unsupported"
  if (Notification.permission === "denied") return "denied"

  if (Notification.permission === "default") {
    const choice = await Notification.requestPermission()
    if (choice !== "granted") return choice === "default" ? "idle" : choice
  }

  return subscribeToPush()
}

/** Abonne un service worker déjà enregistré et persiste l'abonnement. */
export async function subscribeToPush(): Promise<"granted"> {
  const registration = await registerServiceWorker()
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!key) return "granted"

  const existing = await registration.pushManager.getSubscription()
  const subscription =
    existing ?? (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    }))

  const json = subscription.toJSON()
  await fetch("/api/push/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  })

  return "granted"
}

/** Coupe les push : désabonne le navigateur et révoque côté serveur. */
export async function disablePushNotifications(): Promise<PushPermissionState> {
  if (!isPushSupported()) return "unsupported"

  const registration = await registerServiceWorker().catch(() => null)
  const subscription = await registration?.pushManager.getSubscription()
  if (subscription) {
    const endpoint = subscription.endpoint
    await subscription.unsubscribe().catch(() => false)
    await fetch("/api/push/subscription", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint }),
    }).catch(() => null)
  }

  return "idle"
}