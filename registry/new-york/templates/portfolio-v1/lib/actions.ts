"use server"

import { ContactFormSchema } from "./schemas"

export async function contactFormAction(formData: FormData) {
  const endpoint = process.env.BASIN_ENDPOINT

  if (!endpoint) {
    return {
      error: "Contact form is not configured. Set BASIN_ENDPOINT in .env.local.",
    }
  }

  const parsed = ContactFormSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." }
  }

  const { name, email, message } = parsed.data

  const body = new URLSearchParams()
  body.set("name", name)
  body.set("email", email)
  body.set("message", message)

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    if (!response.ok) {
      return { error: "Failed to send message. Please try again." }
    }

    return { success: true as const }
  } catch {
    return { error: "Failed to send message. Please try again." }
  }
}
