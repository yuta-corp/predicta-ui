"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"
import { searchQuartiers, type Quartier } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function QuartierSearch({
  onSelect,
}: {
  onSelect: (lon: number, lat: number) => void
}) {
  const [q, setQ] = useState("")
  const [results, setResults] = useState<Quartier[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const id = setTimeout(async () => {
      try {
        setResults(await searchQuartiers(q, controller.signal))
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResults([])
      }
    }, 250)
    return () => {
      clearTimeout(id)
      controller.abort()
    }
  }, [q])

  return (
    <Command
      shouldFilter={false}
      className={cn(
        "w-64 overflow-visible rounded-lg border border-white/10 bg-black/50 backdrop-blur-md",
      )}
    >
      <div className="flex items-center gap-2 px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <CommandInput
          value={q}
          onValueChange={(v) => {
            setQ(v)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher un quartier…"
          className="h-11"
        />
      </div>
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
