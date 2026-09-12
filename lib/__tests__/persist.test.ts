import { describe, expect, it, vi } from "vitest"

import { getPersistApi } from "@/lib/store/persist"

describe("getPersistApi", () => {
  it("renvoie null quand le store n'expose pas d'API persist", () => {
    // Cas du rendu serveur : zustand n'installe pas `persist` sans stockage.
    expect(getPersistApi({ getState: () => ({}) })).toBeNull()
    expect(getPersistApi(null)).toBeNull()
    expect(getPersistApi("store")).toBeNull()
    expect(getPersistApi({ persist: null })).toBeNull()
    expect(getPersistApi({ persist: {} })).toBeNull()
  })

  it("renvoie l'API quand elle est complète", () => {
    const api = {
      hasHydrated: () => true,
      onFinishHydration: vi.fn(() => () => {}),
      rehydrate: vi.fn(),
    }

    expect(getPersistApi({ persist: api })).toBe(api)
  })
})
