"use client"

import { useEffect } from "react"
import { trafficEngine } from "@/lib/traffic/engine"

export default function ExplorePage() {
  useEffect(() => {
    void trafficEngine.revealCity()
  }, [])

  return null
}
