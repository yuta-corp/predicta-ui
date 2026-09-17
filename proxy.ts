import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

/**
 * Middleware Clerk — nommé proxy.ts car le projet tourne sur Next.js 16+
 * (voir le quickstart Clerk : proxy.ts sur Next 16+, middleware.ts sur 15−).
 *
 * clerkMiddleware n'interdit rien par défaut : la protection est opt-in.
 * Les routes de la zone /friends, /map, /quartiers et /share sont protégées ;
 * le reste (API trafic, webhooks) reste public, et l'authentification est
 * vérifiée au plus près de l'usage (server actions, route handlers). La carte
 * est protégée pour décourager le scraping des tuiles côté client.
 *
 * Redirection volontairement explicite plutôt que `auth.protect()` : `protect()`
 * appelle Clerk sans `returnBackUrl`, donc après connexion l'utilisateur
 * atterrit sur la page par défaut et perd la page demandée — un lien de
 * position partagée reçu par un ami le renvoyait ainsi sur l'accueil. On passe
 * l'URL courante en `returnBackUrl` pour revenir exactement là où il allait.
 */
// Matchers regex : "/map(.*)" matche AUSSI /maplibre-gl-worker.mjs (le worker
// MapLibre commence par "/map") et le redirige vers sign-in — le worker ne se
// charge jamais, donc aucune tuile vecteur (basemap ni trafic) n'est dessinée.
// On cible donc /map exactement (la route est "/map", la query ne compte pas
// pour le pathname) et on garde les préfixes pour les routes à sous-routes.
const isProtectedRoute = createRouteMatcher([
  "/friends(.*)",
  "/map",
  "/quartiers",
  "/share(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return

  const { userId, redirectToSignIn } = await auth()
  if (userId) return

  return redirectToSignIn({ returnBackUrl: req.url })
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|mjs|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}