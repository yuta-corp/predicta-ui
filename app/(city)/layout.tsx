import { MapShell } from "@/components/shell/map-shell"

export const dynamic = "force-dynamic"

export default function CityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MapShell>{children}</MapShell>
}
