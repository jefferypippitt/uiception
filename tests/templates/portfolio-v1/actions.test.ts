import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { contactFormAction } from "@/registry/new-york/templates/portfolio-v1/lib/actions"

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

const validFields = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "This message is definitely long enough to pass validation.",
}

describe("contactFormAction", () => {
  const originalEndpoint = process.env.BASIN_ENDPOINT

  beforeEach(() => {
    process.env.BASIN_ENDPOINT = "https://example.com/basin-endpoint"
  })

  afterEach(() => {
    process.env.BASIN_ENDPOINT = originalEndpoint
    vi.unstubAllGlobals()
  })

  it("returns an error when BASIN_ENDPOINT is not configured", async () => {
    delete process.env.BASIN_ENDPOINT
    const result = await contactFormAction(formData(validFields))
    expect(result).toEqual({
      error: "Contact form is not configured. Set BASIN_ENDPOINT in .env.local.",
    })
  })

  it("returns a validation error for an invalid email, without calling fetch", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)

    const result = await contactFormAction(
      formData({ ...validFields, email: "not-an-email" })
    )

    expect(result.error).toBeDefined()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("silently returns success and never calls fetch when the honeypot field is filled", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)

    const result = await contactFormAction(
      formData({ ...validFields, company: "AutoBot Inc" })
    )

    expect(result).toEqual({ success: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("posts to BASIN_ENDPOINT and returns success on a valid submission", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchSpy)

    const result = await contactFormAction(formData(validFields))

    expect(result).toEqual({ success: true })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe(process.env.BASIN_ENDPOINT)
    expect(init.method).toBe("POST")
  })

  it("returns an error when the endpoint responds non-OK", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))

    const result = await contactFormAction(formData(validFields))

    expect(result).toEqual({ error: "Failed to send message. Please try again." })
  })

  it("returns an error when fetch throws (network failure)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")))

    const result = await contactFormAction(formData(validFields))

    expect(result).toEqual({ error: "Failed to send message. Please try again." })
  })
})
