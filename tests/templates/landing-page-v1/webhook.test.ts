import { afterEach, describe, expect, it, vi } from "vitest"
import type { NextRequest } from "next/server"

const { verifyWebhook } = vi.hoisted(() => ({
  verifyWebhook: vi.fn(),
}))

vi.mock("@clerk/nextjs/webhooks", () => ({
  verifyWebhook,
}))

import { POST } from "@/registry/new-york/templates/landing-page-v1/app/api/webhooks/route"

function makeRequest(): NextRequest {
  return new Request("http://localhost/api/webhooks", {
    method: "POST",
  }) as unknown as NextRequest
}

describe("POST /api/webhooks", () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it("returns 400 with 'Verification failed' when signature verification fails", async () => {
    verifyWebhook.mockRejectedValueOnce(new Error("invalid signature"))

    const res = await POST(makeRequest())

    expect(res.status).toBe(400)
    expect(await res.text()).toBe("Verification failed")
  })

  it("returns 200 with 'OK' for a waitlistEntry.created event", async () => {
    verifyWebhook.mockResolvedValueOnce({
      type: "waitlistEntry.created",
      data: { id: "wl_123", email_address: "a@example.com", status: "pending" },
    })

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })

  it("returns 200 with 'OK' for a waitlistEntry.updated event", async () => {
    verifyWebhook.mockResolvedValueOnce({
      type: "waitlistEntry.updated",
      data: { id: "wl_123", email_address: "a@example.com", status: "approved" },
    })

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })

  it("returns 200 with 'OK' for an unhandled event type without throwing", async () => {
    verifyWebhook.mockResolvedValueOnce({
      type: "user.created",
      data: {},
    })

    const res = await POST(makeRequest())

    expect(res.status).toBe(200)
    expect(await res.text()).toBe("OK")
  })
})
