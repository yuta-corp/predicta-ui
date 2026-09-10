import webPush from "web-push"

/**
 * Configuration VAPID (Web Push). Les clés vivent dans les variables
 * d'environnement : la clé publique est exposée au navigateur
 * (`NEXT_PUBLIC_...`), la clé privée ne sert que côté serveur.
 */
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY
const subject = process.env.VAPID_SUBJECT

/** Vrai dès que l'émetteur peut réellement envoyer des notifications. */
export const pushConfigured = Boolean(publicKey && privateKey && subject)

export const VAPID_PUBLIC_KEY = publicKey ?? ""

if (subject && publicKey && privateKey) {
  webPush.setVapidDetails(subject, publicKey, privateKey)
}

/** Durée de vie d'un push (secondes) : une notification obsolète n'est pas
 * rejouée par le service push si l'appareil était hors-ligne au-delà. */
export const PUSH_TTL_SECONDS = 60 * 60 * 24