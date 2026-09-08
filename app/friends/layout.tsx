import { SiteHeader } from "@/components/shell/site-header"

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      {children}
    </div>
  )
}