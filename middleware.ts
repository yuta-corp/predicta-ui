import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

/**
 * Routes that are publicly accessible without authentication.
 * Private routes (map, quartiers, account, explorer) are protected by default.
 */
const isPublicRoute = createRouteMatcher([
  "/", // Landing page
  "/legal(.*)", // Legal pages
  "/privacy(.*)", // Privacy pages
  "/terms(.*)", // Terms pages
  "/terms-of-sale",
  "/cookies",
  "/status", // Public status page
  "/developers", // API documentation (public)
  "/sign-in(.*)", // Auth pages
  "/sign-up(.*)",
  "/api/predicta/ping(.*)", // Health check endpoint
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
