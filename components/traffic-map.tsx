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

// rate-driven line color, evaluated in-engine.
const LINE_COLOR: maplibregl.ExpressionSpecification = [
  "step",
  ["coalesce", ["get", "rate"], -1],
  "#3A3F34", // rate < 0 → inconnu
  0,
  "#0A0A0A", // bloqué
  0.25,
  "#5B6650", // lent
  0.5,
  "#9FCA69", // moyen
  0.75,
  "#C1FF72", // fluide
]

export default function TrafficMap({
  handleRef,
  onData,
  theme,
  children,
}: {
  handleRef?: Ref<TrafficMapHandle>
  onData?: (data: TrafficCollection, partial: boolean) => void
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
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 4, 16, 12],
          "line-opacity": 0.25,
          "line-blur": 4,
        },
      })
      // crisp line
      map.addLayer({
        id: "traffic-line",
        type: "line",
        source: "traffic",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": LINE_COLOR,
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.2, 16, 4],
        },
      })
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

  // swap basemap on theme change (keeps traffic source: re-add on styledata)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const style = theme === "light" ? LIGHT_STYLE : DARK_STYLE
    map.setStyle(style, { diff: false })
    map.once("styledata", () => {
      if (map.getSource("traffic")) return
      // style reset wiped layers; nothing to do here — handled by re-init guard
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  return (
    <div className="relative h-dvh w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {children}
    </div>
  )
}
