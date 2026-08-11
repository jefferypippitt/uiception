"use server"

export type RegisterResult =
  | { success: true }
  | { error: string }

/**
 * Called after the Questionnaire client validates every required step.
 * Replace the body of this function with your own persistence / email /
 * CRM call — FormData keys match `site.register.questions[].name`.
 */
export async function registerAction(
  formData: FormData
): Promise<RegisterResult> {
  const role = String(formData.get("role") ?? "").trim()
  const track = String(formData.get("track") ?? "").trim()
  const team = String(formData.get("team") ?? "").trim()
  const contact = String(formData.get("contact") ?? "").trim()

  if (!role) {
    return { error: "Pick a role to continue." }
  }

  if (!track) {
    return { error: "Pick a track to continue." }
  }

  if (!contact) {
    return { error: "Enter an email so we can send your ticket." }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return { error: "Enter a valid email address." }
  }

  const payload = {
    role,
    track,
    team: team || null,
    contact,
  }

  // --- Your backend goes here ------------------------------------------
  // Example:
  //   await fetch(process.env.REGISTER_ENDPOINT!, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   })
  // ---------------------------------------------------------------------
  void payload

  return { success: true }
}
