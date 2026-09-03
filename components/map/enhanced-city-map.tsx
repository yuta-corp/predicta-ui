"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, MapMouseEvent, MapGeoJSONFeature } from "maplibre-gl";
import { CityMap } from "./city-map";
import { getLiveMap } from "./city-map";

interface EnhancedCityMapProps extends React.ComponentPropsWithoutRef<typeof CityMap> {}

/**
 * EnhancedCityMap wraps CityMap to add:
 * - Hover highlighting of road segments using feature state
 * - Smoother map transitions via default easing
 * - Error boundary with fallback UI
 * - Proper cleanup of listeners and feature state
 */
export function EnhancedCityMap({
  className,
  interactive = true,
  onReady,
  drift = false,
  forceDark = false,
  forceLight = false,
  showControls = true,
  ...props
}: EnhancedCityMapProps) {
  const hoverFeatureIdRef = useRef<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set up enhanced features after map loads
  useEffect(() => {
    if (error) return; // don't enhance if error

    const setupEnhancements = () => {
      const map = getLiveMap();
      if (!map) return;

      // 1. Smoother transitions: set default easing if available
      if (typeof (map as any).setDefaultEasing === "function") {
        (map as any).setDefaultEasing("cubic-bezier(0.25, 0.46, 0.45, 0.94)");
      }

      // 2. Add a hover highlight layer if not exists
      const layerId = "traffic-hover-highlight";
      if (!map.getLayer(layerId)) {
        // Ensure the traffic source is loaded
        if (map.isStyleLoaded()) {
          map.addLayer({
            id: layerId,
            type: "line",
            source: "traffic",
            "source-layer": "speeds",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#00ffff", // cyan highlight
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10, 4,
                14, 7
              ],
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.7,
                0
              ],
            },
          });
        } else {
          // Wait for style to load
          const listener = () => {
            if (!map.getLayer(layerId)) {
              map.addLayer({
                id: layerId,
                type: "line",
                source: "traffic",
                "source-layer": "speeds",
                layout: {
                  "line-cap": "round",
                  "line-join": "round",
                },
                paint: {
                  "line-color": "#00ffff",
                  "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10, 4,
                    14, 7
                  ],
                  "line-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    0.7,
                    0
                  ],
                },
              });
            }
            map.off("style.load", listener);
          };
          map.on("style.load", listener);
        }
      }

      // 3. Hover highlighting using feature state
      let hoverRequestId = 0;
      const onMouseMove = (e: MapMouseEvent) => {
        if (!interactive) return;
        hoverRequestId++;
        const requestId = hoverRequestId;

        // Use requestAnimationFrame to debounce
        requestAnimationFrame(() => {
          if (requestId !== hoverRequestId) return; // stale
          const point = e.point;
          const features = map.queryRenderedFeatures(point, {
            layers: [
              "traffic-fluid",
              "traffic-moderate",
              "traffic-dense",
              "traffic-unknown",
            ],
          });

          if (features.length > 0) {
            const feature = features[0] as MapGeoJSONFeature;
            const id = feature.id?.toString();
            if (id && id !== hoverFeatureIdRef.current) {
              // Clear previous hover state
              if (hoverFeatureIdRef.current) {
                map.setFeatureState(
                  { source: "traffic", sourceLayer: "speeds", id: hoverFeatureIdRef.current },
                  { hover: false }
                );
              }
              // Set hover state on new feature
              map.setFeatureState(
                { source: "traffic", sourceLayer: "speeds", id },
                { hover: true }
              );
              hoverFeatureIdRef.current = id;
            }
          } else {
            // No feature under cursor: clear hover state
            if (hoverFeatureIdRef.current) {
              map.setFeatureState(
                { source: "traffic", sourceLayer: "speeds", id: hoverFeatureIdRef.current },
                { hover: false }
              );
              hoverFeatureIdRef.current = null;
            }
          }
        });
      };

      const onMouseLeave = () => {
        if (hoverFeatureIdRef.current) {
          map.setFeatureState(
            { source: "traffic", sourceLayer: "speeds", id: hoverFeatureIdRef.current },
            { hover: false }
          );
          hoverFeatureIdRef.current = null;
        }
      };

      map.on("mousemove", onMouseMove);
      map.getCanvas().addEventListener("mouseleave", onMouseLeave);

      // Store cleanup function
      cleanupRef.current = () => {
        map.off("mousemove", onMouseMove);
        map.getCanvas().removeEventListener("mouseleave", onMouseLeave);
        // Clear any remaining hover state
        if (hoverFeatureIdRef.current) {
          map.setFeatureState(
            { source: "traffic", sourceLayer: "speeds", id: hoverFeatureIdRef.current },
            { hover: false }
          );
          hoverFeatureIdRef.current = null;
        }
        // Remove the custom layer
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        // Reset default easing? Not necessary.
      };
    };

    // Wait for map to be available
    const waitForMap = () => {
      const map = getLiveMap();
      if (map) {
        setupEnhancements();
      } else {
        const timer = setTimeout(waitForMap, 50);
        return () => clearTimeout(timer);
      }
    };

    const cleanupWait = waitForMap();
    return () => {
      cleanupWait?.();
      cleanupRef.current?.();
    };
  }, [interactive, onReady, drift, forceDark, forceLight, showControls]);

  // Error boundary: if CityMap throws during render, we catch and show fallback.
  if (error) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <h3 className="mb-2">Map temporarily unavailable</h3>
          <p className="sm:max-w-xl">{error}</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <CityMap
        className={className}
        interactive={interactive}
        onReady={onReady}
        drift={drift}
        forceDark={forceDark}
        forceLight={forceLight}
        showControls={showControls}
        {...props}
      />
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unknown error");
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <h3 className="mb-2">Map temporarily unavailable</h3>
          <p className="sm:max-w-xl">{error}</p>
        </div>
      </div>
    );
  }
}