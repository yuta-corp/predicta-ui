import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

/**
 * Middleware Clerk — nommé proxy.ts car le projet tourne sur Next.js 16+
 * (voir le quickstart Clerk : proxy.ts sur Next 16+, middleware.ts sur 15−).
 *
 * clerkMiddleware n'interdit rien par défaut : la protection est opt-in.
 * Les routes de la zone /friends, /map et /share sont protégées ; le reste
 * (API trafic, webhooks) reste public, et l'authentification est vérifiée
 * au plus près de l'usage (server actions, route handlers). La carte est
 * protégée pour décourager le scraping des tuiles côté client.
 */
const isProtectedRoute = createRouteMatcher(["/friends(.*)", "/map(.*)", "/share(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
}