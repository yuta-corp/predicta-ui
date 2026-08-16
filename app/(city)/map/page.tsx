"use client"

import { useEffect } from "react"
import { trafficEngine } from "@/lib/traffic/engine"

export default function ExplorePage() {
  // Première visite : la ville se construit sous les yeux.
  useEffect(() => {
    void trafficEngine.revealCity()
  }, [])

  return null
}
