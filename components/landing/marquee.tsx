"use client"

import { useMemo } from "react"

import { quartiers } from "@/lib/data/quartiers"

/**
 * Bande défilante des quartiers — les vrais noms de la ville, prélevés dans
 * le catalogue réel (un sur sept, triés). C'est de la donnée, pas du décor :
 * la ville est une liste de lieux que l'on peut explorer.
 */
export function QuartierMarquee() {
  const names = useMemo(() => {
    const sorted = [...quartiers].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    )
    const picked: string[] = []
    for (let i = 0; i < sorted.length; i += 7) picked.push(sorted[i].name)
    return picked
  }, [])

  return (
    <div
      aria-label="Quartiers d'Antananarivo"
      className="overflow-hidden border-y border-border/60 bg-background py-3.5"
    >
      <div className="animate-marquee flex w-max">
        <MarqueeRow names={names} />
        <MarqueeRow names={names} ariaHidden />
      </div>
    </div>
  )
}

function MarqueeRow({
  names,
  ariaHidden,
}: {
  names: string[]
  ariaHidden?: boolean
}) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {names.map((name) => (
        <span
          key={name}
          className="flex items-center gap-10 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/85"
        >
          {name}
          <span aria-hidden className="h-[3px] w-[3px] bg-primary/80" />
        </span>
      ))}
    </div>
  )
}
