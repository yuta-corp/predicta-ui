import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { GeoJsonExplorer } from "@/components/dev/geo-json-explorer"

export default function ExplorerPage() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute right-4 top-16 bottom-16 z-20 w-[min(30rem,calc(100vw-2rem))]">
        <div className="mb-2 flex items-center justify-between px-1">
          <Link
            href="/developers"
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
            Documentation
          </Link>
          <p className="text-[11px] text-muted-foreground/70">
            Cliquez sur la carte pour explorer
          </p>
        </div>
        <GeoJsonExplorer />
      </div>
    </div>
  )
}
