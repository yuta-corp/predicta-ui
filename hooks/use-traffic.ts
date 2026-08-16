"use client"

import { useSyncExternalStore } from "react"
import { trafficEngine } from "@/lib/traffic/engine"

/** Abonnement réactif à l'état global du moteur trafic. */
export function useTraffic() {
  const state = useSyncExternalStore(
    (fn) => trafficEngine.subscribe(fn),
    () => trafficEngine.getSnapshot(),
    // Snapshot serveur : l'état du moteur est synchrone et sans dépendance
    // au navigateur — les pages client sont pré-rendues par Next.
    () => trafficEngine.getSnapshot()
  )
  return { engine: trafficEngine, state }
}
