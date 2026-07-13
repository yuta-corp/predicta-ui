"use client"

import { useEffect, useImperativeHandle, useRef } from "react"
import type { Ref } from "react"
import maplibregl from "maplibre-gl"
import { getTraffic, type TrafficCollection } from "@/lib/api"

// OpenFreeMap dark vector style — no API key.
const DARK_STYLE = "https://tiles.openfreemap.org/styles/dark"
const LIGHT_STYLE = "https://tiles.openfreemap.org/styles/liberty"
const TANA: [number, number] = [47.5210, -18.8792]

export type TrafficMapHandle = { flyTo: (lon: number, lat: number) => void }

// Veines vertes — flux encodé par luminosité, pas par teinte. Tout reste visible.
const LINE_COLOR: maplibregl.ExpressionSpecification = [
  "step",
  ["coalesce", ["get", "rate"], -1],
  "#2E3A27", // rate < 0 → inconnu (vert sourd)
  0,
  "#3F7A34", // bloqué → vert profond
  0.25,
  "#66B23C", // lent
  0.5,
  "#9FE85C", // moyen
  0.75,
  "#C1FF72", // fluide → lime éclatant
]

export default function TrafficMap({
  handleRef,
  onData,
  onReady,
  theme,
  children,
}: {
  handleRef?: Ref<TrafficMapHandle>
  onData?: (data: TrafficCollection, partial: boolean) => void
  onReady?: () => void
  theme?: "dark" | "light"
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useImperativeHandle(handleRef, () => ({
    flyTo: (lon, lat) =>
      mapRef.current?.flyTo({ center: [lon, lat], zoom: 15, speed: 1.4 }),
  }))

  // init map once
  useEffect(() => {
    if (!containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: theme === "light" ? LIGHT_STYLE : DARK_STYLE,
      center: TANA,
      zoom: 12.5,
      attributionControl: { compact: true },
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right")

    map.on("load", () => {
      map.addSource("traffic", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      })
      // glow underlay
      map.addLayer({
        id: "traffic-glow",
        type: "line",
        source: "traffic",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": LINE_COLOR,
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 7, 16, 20],
          "line-opacity": 0.4,
          "line-blur": 8,
        },
      })
      // crisp line — veines épaisses, bien chargées
      map.addLayer({
        id: "traffic-line",
        type: "line",
        source: "traffic",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": LINE_COLOR,
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2.2, 16, 7],
          "line-opacity": 0.95,
        },
      })
      onReady?.() // basemap prêt → lève le loader; le trafic (payload lourd) arrive après
      void loadTraffic()
    })

    let cancelled = false
    const controller = new AbortController()
    async function loadTraffic() {
      try {
        const { data, partial } = await getTraffic(controller.signal)
        if (cancelled) return
        const src = map.getSource("traffic") as maplibregl.GeoJSONSource | undefined
        src?.setData(data as GeoJSON.FeatureCollection)
        onData?.(data, partial)
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.warn("traffic:", e)
      }
    }

    // refetch every 30 min (backend cadence)
    const iv = setInterval(loadTraffic, 30 * 60 * 1000)

    return () => {
      cancelled = true
      controller.abort()
      clearInterval(iv)
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // theme swap = full remount via key in page.tsx (clean basemap + layers), no in-place setStyle.

  return (
    <div className="relative h-dvh w-full">
      <div ref={containerRef} className="h-full w-full" />
      {children}
    </div>
  )
}
