"use client"

import { create } from "zustand"

import {
  getMyLocationSharing,
  stopLocationSharing,
  updateLocation,
} from "@/lib/actions/location"
import { SHARE_INTERVAL_MS } from "@/lib/location-constants"
import { selectPreciseFix } from "@/lib/map/fix-selection"
import {
  GEOLOCATION_PERMISSION_DENIED,
  GEOLOCATION_UNAVAILABLE,
  messageFromGeoError,
} from "@/lib/map/geolocation-messages"
import { createPositionFilter, type PositionFix } from "@/lib/map/position-filter"

/* -------------------------------------------------------------------------- */
/* Constantes                                                                  */
/* -------------------------------------------------------------------------- */

/** Précision (m) jugée suffisante pour publier la toute première position. */
export const FIRST_FIX_ACCURACY_M = 150

/** Attente maximale (ms) d'un fix fiable avant de publier le meilleur reçu. */
export const FIRST_FIX_TIMEOUT_MS = 20_000

/**
 * Fenêtre (ms) dans laquelle un fix plus précis peut remplacer le dernier reçu.
 * Volontairement courte : au-delà, préférer la fraîcheur à la précision.
 */
export const PRECISE_FIX_WINDOW_MS = 5_000

/** Taille maximale du tampon de fixes (borne dure, pas d'allocation illimitée). */
export const FIX_BUFFER_MAX = 16

/** Erreurs de watch consécutives avant d'avertir que la position ne bouge plus. */
export const WATCH_FAILURE_LIMIT = 3

export const UPDATE_FAILED_MESSAGE =
  "La mise à jour de votre position échoue. Vérifiez votre connexion."
export const STOP_FAILED_MESSAGE = "Impossible d'arrêter le partage pour le moment."

/** Géolocalisation « précision maximale » : GPS, aucun cache, timeout large. */
const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 30_000,
}

/**
 * Filtre anti-tremblement de la session de partage. `staleAfterMs` dépasse
 * nettement la cadence de publication : un fix quasi identique ne remplace pas
 * le point publié simplement parce que le temps passe (le point ne tremble pas
 * au mètre près) — mais il bouge tout de même après trois minutes d'immobilité,
 * sans jamais geler indéfiniment.
 */
const SHARING_FILTER_OPTIONS = {
  minMoveM: 10,
  betterAccuracyRatio: 0.7,
  staleAfterMs: SHARE_INTERVAL_MS * 6,
}

/* -------------------------------------------------------------------------- */
/* Session GPS (état module : un seul capteur par onglet)                      */
/* -------------------------------------------------------------------------- */

interface SharingSession {
  watchId: number | null
  publishTimer: ReturnType<typeof setInterval> | null
  firstFixTimer: ReturnType<typeof setTimeout> | null
  firstFixResolve: ((fix: PositionFix | null) => void) | null
  firstFixReject: ((error: unknown) => void) | null
  buffer: PositionFix[]
  filter: ReturnType<typeof createPositionFilter>
  lastPublished: PositionFix | null
  watchFailures: number
}

function createSession(): SharingSession {
  return {
    watchId: null,
    publishTimer: null,
    firstFixTimer: null,
    firstFixResolve: null,
    firstFixReject: null,
    buffer: [],
    filter: createPositionFilter(SHARING_FILTER_OPTIONS),
    lastPublished: null,
    watchFailures: 0,
  }
}

let session: SharingSession = createSession()

/**
 * Coupe le capteur et l'intervalle, puis libère une éventuelle attente de
 * premier fix (`null` = session abandonnée) avant de repartir d'une session
 * vierge.
 */
function clearSession(): void {
  const current = session
  if (current.watchId !== null && typeof navigator !== "undefined") {
    navigator.geolocation.clearWatch(current.watchId)
  }
  if (current.publishTimer !== null) clearInterval(current.publishTimer)
  if (current.firstFixTimer !== null) clearTimeout(current.firstFixTimer)
  const pendingFirstFix = current.firstFixResolve
  session = createSession()
  pendingFirstFix?.(null)
}

/**
 * Réveille l'attente du premier fix : une erreur la rejette, `null` signifie
 * « session abandonnée », sinon la position acquise est transmise.
 */
function settleFirstFix(fix: PositionFix | null, error: unknown): void {
  const resolve = session.firstFixResolve
  const reject = session.firstFixReject
  if (session.firstFixTimer !== null) clearTimeout(session.firstFixTimer)
  session.firstFixTimer = null
  session.firstFixResolve = null
  session.firstFixReject = null
  if (!resolve) return
  if (error !== null && error !== undefined) reject?.(error)
  else resolve(fix)
}

function positionToFix(position: GeolocationPosition): PositionFix {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  }
}

/** Ajoute un fix au tampon borné (les plus anciens sont évincés). */
function pushFix(fix: PositionFix): void {
  session.buffer.push(fix)
  if (session.buffer.length > FIX_BUFFER_MAX) session.buffer.shift()
}

function hasGeolocation(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator
}

/** Fix produit par le capteur : met à jour le tampon et libère l'attente. */
function handleFix(fix: PositionFix): void {
  session.watchFailures = 0
  pushFix(fix)
  if (session.firstFixResolve && fix.accuracy <= FIRST_FIX_ACCURACY_M) {
    settleFirstFix(fix, null)
  }
  if (useLocationSharingStore.getState().error !== null) {
    useLocationSharingStore.setState({ error: null })
  }
}

function handleWatchError(error: GeolocationPositionError): void {
  session.watchFailures += 1
  if (session.firstFixResolve) {
    settleFirstFix(null, error)
    return
  }
  // Permission retirée en cours de partage : plus aucune position ne peut être
  // publiée, on arrête le partage au lieu de laisser croire qu'il fonctionne.
  if (error.code === GEOLOCATION_PERMISSION_DENIED) {
    void abandonSharing(messageFromGeoError(error))
    return
  }
  if (session.watchFailures >= WATCH_FAILURE_LIMIT) {
    useLocationSharingStore.setState({ error: UPDATE_FAILED_MESSAGE })
  }
}

/** Démarre le capteur continu + la cadence de publication, attend un 1er fix. */
function startSession(): Promise<PositionFix | null> {
  const firstFix = new Promise<PositionFix | null>((resolve, reject) => {
    session.firstFixResolve = resolve
    session.firstFixReject = reject
    session.firstFixTimer = setTimeout(() => {
      settleFirstFix(selectPreciseFix(session.buffer, Date.now(), FIRST_FIX_TIMEOUT_MS), null)
    }, FIRST_FIX_TIMEOUT_MS)
  })

  session.watchId = navigator.geolocation.watchPosition(
    (position) => handleFix(positionToFix(position)),
    handleWatchError,
    GEO_OPTIONS
  )
  session.publishTimer = setInterval(() => {
    void publishLatest()
  }, SHARE_INTERVAL_MS)

  return firstFix
}

async function publishFix(fix: PositionFix): Promise<void> {
  await updateLocation(fix.latitude, fix.longitude, fix.accuracy)
  session.lastPublished = fix
}

/**
 * Publie la meilleure position connue. Le point publié ne bouge que sur un
 * déplacement réel (filtre anti-tremblement) ; sinon on republie le dernier
 * point pour maintenir le partage actif côté serveur (battement de cœur).
 */
async function publishLatest(): Promise<void> {
  const candidate =
    selectPreciseFix(session.buffer, Date.now(), PRECISE_FIX_WINDOW_MS) ??
    session.buffer.at(-1) ??
    null
  if (candidate === null) return

  const accepted = session.filter.next(candidate) ?? session.lastPublished
  if (accepted === null) return

  try {
    await publishFix(accepted)
  } catch (err) {
    console.error("[location] mise à jour de la position échouée :", err)
    if (useLocationSharingStore.getState().error === null) {
      useLocationSharingStore.setState({ error: UPDATE_FAILED_MESSAGE })
    }
  }
}

/** Arrêt subi (permission retirée) : capteur coupé + ligne serveur supprimée. */
async function abandonSharing(message: string): Promise<void> {
  clearSession()
  useLocationSharingStore.setState({ phase: "off", error: message })
  try {
    await stopLocationSharing()
  } catch (err) {
    console.error("[location] arrêt du partage impossible :", err)
  }
}

/* -------------------------------------------------------------------------- */
/* Store                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * `off`      : rien n'est partagé.
 * `locating` : l'utilisateur a activé le partage, le capteur acquiert une
 *              première position fiable (rien n'est encore publié).
 * `sharing`  : une position est publiée et rafraîchie.
 */
export type SharingPhase = "off" | "locating" | "sharing"

interface LocationSharingState {
  /** Identifiant Clerk de l'utilisateur courant (null hors session). */
  userId: string | null
  phase: SharingPhase
  /** Dernière erreur utilisateur, ou null. */
  error: string | null

  /** Change d'utilisateur : coupe la session locale et resynchronise. */
  setUser: (userId: string | null) => void
  /**
   * Reprend le partage si le serveur en garde la trace (rafraîchissement de
   * page, autre onglet) — la base est la source de vérité de l'état partagé.
   */
  syncFromServer: () => Promise<void>
  /** Active le partage (permission + premier fix + publication). */
  startSharing: () => Promise<boolean>
  /** Désactive le partage et supprime la position publiée. */
  stopSharing: () => Promise<boolean>
}

type SharingSet = (partial: Partial<LocationSharingState>) => void
type SharingGet = () => LocationSharingState

interface SharingContext {
  set: SharingSet
  get: SharingGet
}

/** Change d'utilisateur : coupe la session locale et resynchronise. */
function createSetUser({ set, get }: SharingContext) {
  return (userId: string | null) => {
    if (get().userId === userId) return
    clearSession()
    set({ userId, phase: "off", error: null })
    if (userId !== null) void get().syncFromServer()
  }
}

/**
 * Reprend le partage si le serveur en garde la trace (rafraîchissement de page,
 * autre onglet) — la base est la source de vérité de l'état partagé.
 */
function createSyncFromServer({ get }: Pick<SharingContext, "get">) {
  return async () => {
    const { userId, phase } = get()
    if (userId === null || phase !== "off") return
    try {
      const sharing = await getMyLocationSharing()
      // L'utilisateur ou l'état ont pu changer pendant l'aller-retour : on
      // n'écrase jamais une action utilisateur plus récente.
      if (!sharing || get().userId !== userId || get().phase !== "off") return
      await get().startSharing()
    } catch (err) {
      console.error("[location] état du partage indisponible :", err)
    }
  }
}

/** Active le partage (permission + premier fix + publication). */
function createStartSharing({ set, get }: SharingContext) {
  return async () => {
    const { userId, phase } = get()
    if (userId === null || phase !== "off") return false
    if (!hasGeolocation()) {
      set({ error: GEOLOCATION_UNAVAILABLE })
      return false
    }

    clearSession()
    set({ phase: "locating", error: null })

    let firstFix: PositionFix | null
    try {
      firstFix = await startSession()
    } catch (err) {
      clearSession()
      set({ phase: "off", error: messageFromGeoError(err) })
      return false
    }
    // Session abandonnée pendant l'acquisition (arrêt manuel) : rien à publier.
    if (firstFix === null) return false

    try {
      await publishFix(firstFix)
    } catch (err) {
      console.error("[location] publication initiale échouée :", err)
      clearSession()
      set({ phase: "off", error: UPDATE_FAILED_MESSAGE })
      return false
    }

    set({ phase: "sharing" })
    return true
  }
}

/** Désactive le partage et supprime la position publiée. */
function createStopSharing({ set, get }: SharingContext) {
  return async () => {
    const wasActive = get().phase !== "off"
    clearSession()
    set({ phase: "off", error: null })
    if (!wasActive) return true
    try {
      await stopLocationSharing()
      return true
    } catch (err) {
      console.error("[location] arrêt du partage impossible :", err)
      set({ error: STOP_FAILED_MESSAGE })
      return false
    }
  }
}

export const useLocationSharingStore = create<LocationSharingState>((set, get) => ({
  userId: null,
  phase: "off",
  error: null,
  setUser: createSetUser({ set, get }),
  syncFromServer: createSyncFromServer({ get }),
  startSharing: createStartSharing({ set, get }),
  stopSharing: createStopSharing({ set, get }),
}))

/**
 * Republie immédiatement si un partage est actif — à appeler quand l'onglet
 * redevient visible ou que le réseau revient (les intervalles en arrière-plan
 * sont bridés par le navigateur, la position publiée peut avoir du retard).
 */
export function publishSharingNow(): void {
  if (useLocationSharingStore.getState().phase !== "sharing") return
  void publishLatest()
}
