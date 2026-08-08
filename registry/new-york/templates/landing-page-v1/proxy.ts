import { clerkMiddleware } from "@clerk/nextjs/server"

// Public waitlist landing. /api/webhooks stays reachable because this middleware
// does not call auth.protect() — keep it that way (or exclude the route) if you
// add protected pages later.
export default clerkMiddleware()

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
