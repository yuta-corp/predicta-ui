"use client"

import { useMemo, useState } from "react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"
import quartiers from "@/lib/quartiers.json"
import { cn } from "@/lib/utils"

// ponytail: quartiers = seed statique (nom+centroïde) embarqué, filtré côté client.
// Zéro appel Lambda. Régénérer depuis predictaapi V1__quartiers.sql si le seed change.
type Quartier = { name: string; lon: number; lat: number }

export default function QuartierSearch({
  onSelect,
}: {
  onSelect: (lon: number, lat: number) => void
}) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return (quartiers as Quartier[])
      .filter((qt) => qt.name.toLowerCase().includes(needle))
      .slice(0, 20)
  }, [q])

  return (
    <Command
      shouldFilter={false}
      className={cn(
        "w-64 overflow-visible rounded-xl border border-border bg-[var(--glass)] backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45)]",
      )}
    >
      <CommandInput
        value={q}
        onValueChange={(v) => {
          setQ(v)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Chercher un quartier…"
      />
      {open && q.length > 0 ? (
        <CommandList className="max-h-64">
          <CommandEmpty>Aucun quartier</CommandEmpty>
          {results.map((qt) => (
            <CommandItem
              key={`${qt.name}-${qt.lon}-${qt.lat}`}
              value={qt.name}
              onSelect={() => {
                onSelect(qt.lon, qt.lat)
                setOpen(false)
                setQ(qt.name)
              }}
            >
              {qt.name}
            </CommandItem>
          ))}
        </CommandList>
      ) : null}
    </Command>
  )
}
