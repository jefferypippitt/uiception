import { describe, expect, it } from "vitest"
import { registerAction } from "@/registry/new-york/templates/landing-page-v2/lib/actions"

function formData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

const validFields = {
  role: "engineer",
  track: "ai",
  contact: "ada@example.com",
}

describe("registerAction", () => {
  it("returns an error when role is missing", async () => {
    const result = await registerAction(
      formData({ track: "ai", contact: "ada@example.com" })
    )

    expect(result).toEqual({ error: "Pick a role to continue." })
  })

  it("returns an error when track is missing", async () => {
    const result = await registerAction(
      formData({ role: "engineer", contact: "ada@example.com" })
    )

    expect(result).toEqual({ error: "Pick a track to continue." })
  })

  it("returns an error when contact is missing", async () => {
    const result = await registerAction(
      formData({ role: "engineer", track: "ai" })
    )

    expect(result).toEqual({
      error: "Enter an email so we can send your ticket.",
    })
  })

  it("returns an error when contact is not a valid email", async () => {
    const result = await registerAction(
      formData({ ...validFields, contact: "not-an-email" })
    )

    expect(result).toEqual({ error: "Enter a valid email address." })
  })

  it("returns success when all required fields are valid and team is omitted", async () => {
    const result = await registerAction(formData(validFields))

    expect(result).toEqual({ success: true })
  })

  it("returns success when all required fields are valid and team is provided", async () => {
    const result = await registerAction(
      formData({ ...validFields, team: "have-team" })
    )

    expect(result).toEqual({ success: true })
  })
})
