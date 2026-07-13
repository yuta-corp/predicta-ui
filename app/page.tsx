"use client"

import { useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import type { TrafficMapHandle } from "@/components/traffic-map"
import type { TrafficCollection } from "@/lib/api"
import { computeLiveSummary } from "@/lib/summary"
import {
  BrandMark,
  LiveStats,
  Legend,
  Freshness,
  Reveal,
} from "@/components/map-overlays"
import { Atmosphere } from "@/components/atmosphere"
import QuartierSearch from "@/components/quartier-search"
import { LoadingScreen } from "@/components/loading-screen"

const TrafficMap = dynamic(() => import("@/components/traffic-map"), {
  ssr: false,
})

export default function Page() {
  const handleRef = useRef<TrafficMapHandle>(null)
  const [data, setData] = useState<TrafficCollection | null>(null)
  const [partial, setPartial] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const { resolvedTheme } = useTheme()

  const onData = useCallback((d: TrafficCollection, p: boolean) => {
    setData(d)
    setPartial(p)
    setUpdatedAt(new Date())
  }, [])

  const summary = computeLiveSummary(data)
  const ready = updatedAt !== null // trafic chargé → révèle le HUD

  return (
    <>
    <LoadingScreen done={mapReady} />
    <TrafficMap
      // remount on theme change → clean basemap swap without layer surgery
      key={`${resolvedTheme}-${reloadKey}`}
      handleRef={handleRef}
      onData={onData}
      onReady={() => setMapReady(true)}
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <Atmosphere />
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-4">
          <Reveal show={ready} delay={100}>
            <BrandMark />
          </Reveal>
          <Reveal show={ready} delay={200} className="pointer-events-auto">
            <QuartierSearch
              onSelect={(lon, lat) => handleRef.current?.flyTo(lon, lat)}
            />
          </Reveal>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <Reveal show={ready} delay={300}>
              <LiveStats summary={summary} partial={partial} />
            </Reveal>
            <Reveal show={ready} delay={400}>
              <Legend />
            </Reveal>
          </div>
          <Reveal show={ready} delay={500}>
            <Freshness
              updatedAt={updatedAt}
              onRefresh={() => setReloadKey((k) => k + 1)}
            />
          </Reveal>
        </div>
      </div>
    </TrafficMap>
    </>
  )
}
