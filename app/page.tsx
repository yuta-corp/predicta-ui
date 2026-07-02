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
} from "@/components/map-overlays"
import QuartierSearch from "@/components/quartier-search"

const TrafficMap = dynamic(() => import("@/components/traffic-map"), {
  ssr: false,
})

export default function Page() {
  const handleRef = useRef<TrafficMapHandle>(null)
  const [data, setData] = useState<TrafficCollection | null>(null)
  const [partial, setPartial] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const { resolvedTheme } = useTheme()

  const onData = useCallback((d: TrafficCollection, p: boolean) => {
    setData(d)
    setPartial(p)
    setUpdatedAt(new Date())
  }, [])

  const summary = computeLiveSummary(data)

  return (
    <TrafficMap
      // remount on theme change → clean basemap swap without layer surgery
      key={`${resolvedTheme}-${reloadKey}`}
      handleRef={handleRef}
      onData={onData}
      theme={resolvedTheme === "light" ? "light" : "dark"}
    >
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-4">
          <BrandMark />
          <div className="pointer-events-auto">
            <QuartierSearch
              onSelect={(lon, lat) => handleRef.current?.flyTo(lon, lat)}
            />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <LiveStats summary={summary} partial={partial} />
            <Legend />
          </div>
          <Freshness
            updatedAt={updatedAt}
            onRefresh={() => setReloadKey((k) => k + 1)}
          />
        </div>
      </div>
    </TrafficMap>
  )
}
