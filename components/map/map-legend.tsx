"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Légende des couleurs trafic — pastille colorée + label + fourchette de taux.
 * S'adapte au thème clair/sombre via les classes Tailwind dark:.
 */

const LEGEND_ITEMS = [
  {
    id: "fluid",
    color: "bg-[#7fae3f] dark:bg-[#9fca69]",
    label: "Fluide",
    description: "Taux ≥ 75 %",
  },
  {
    id: "moderate",
    color: "bg-[#df9f3a] dark:bg-[#e0b25c]",
    label: "Modéré",
    description: "50 % ≤ Taux < 75 %",
  },
  {
    id: "dense",
    color: "bg-[#d95f45] dark:bg-[#dd6a4c]",
    label: "Dense",
    description: "Taux < 50 %",
  },
  {
    id: "unknown",
    color: "bg-[#b3b8a6] dark:bg-[#54584e]",
    label: "Indisponible",
    description: "Données non disponibles",
  },
] as const

export function MapLegend() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-col rounded-lg border border-border bg-background/85 shadow-lg backdrop-blur-md",
        "transition-all duration-300 ease-out",
        expanded ? "w-52" : "w-auto"
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={expanded}
        aria-label="Légende du trafic"
      >
        {/* Mini palette always visible */}
        <div className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7fae3f] dark:bg-[#9fca69]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#df9f3a] dark:bg-[#e0b25c]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#d95f45] dark:bg-[#dd6a4c]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#b3b8a6] dark:bg-[#54584e]" />
        </div>
        <ChevronDownIcon
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="animate-fade-in border-t border-border/60 px-3 py-2.5">
          <dl className="flex flex-col gap-2">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "inline-block h-3 w-5 flex-shrink-0 rounded-sm",
                    item.color
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  <dt className="text-[11px] font-medium leading-tight text-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-[10px] leading-tight text-muted-foreground">
                    {item.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
