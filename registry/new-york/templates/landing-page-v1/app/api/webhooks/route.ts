import { verifyWebhook } from "@clerk/nextjs/webhooks"
import type { NextRequest } from "next/server"

/**
 * Clerk waitlist webhooks — verify every delivery, then react to
 * waitlistEntry.created / waitlistEntry.updated.
 *
 * Local testing:
 *   clerk webhooks listen --forward-to http://localhost:3000/api/webhooks
 * Add the printed relay URL as a Dashboard webhook endpoint (subscribe to
 * waitlistEntry.*), then put that endpoint's signing secret in
 * CLERK_WEBHOOK_SIGNING_SECRET.
 */
export async function POST(req: NextRequest) {
  let evt
  try {
    evt = await verifyWebhook(req)
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return new Response("Verification failed", { status: 400 })
  }

  if (
    evt.type === "waitlistEntry.created" ||
    evt.type === "waitlistEntry.updated"
  ) {
    const { id, email_address, status } = evt.data
    // Hook your own side effects here (DB insert, Resend, Slack, etc.).
    console.log(`[waitlist] ${evt.type}`, { id, email: email_address, status })
  }

  return new Response("OK", { status: 200 })
}
