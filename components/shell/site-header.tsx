import { AuthCluster } from "@/components/auth/auth-cluster"
import { Nav } from "@/components/shell/nav"
import { Wordmark } from "@/components/shell/wordmark"

/**
 * En-tête minimal partagé — pages documentaires, amis et statut :
 * wordmark, navigation principale (desktop) et bloc authentification.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex items-center gap-5">
          <Wordmark />
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>
        <AuthCluster />
      </div>
    </header>
  )
}