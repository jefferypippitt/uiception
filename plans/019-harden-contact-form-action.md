# Plan 019: Harden portfolio-v1's contact form against spam and double-submit

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8cdba30..HEAD -- registry/new-york/templates/portfolio-v1/lib/actions.ts registry/new-york/templates/portfolio-v1/lib/schemas.ts registry/new-york/templates/portfolio-v1/components/contact-form.tsx`
> If any of these three files changed since this plan was written, re-read
> them and compare against the "Current state" excerpts below before
> proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `8cdba30`, 2026-08-06

## Why this matters

`portfolio-v1`'s contact form (`lib/actions.ts`'s `contactFormAction`) is a
Next.js Server Action — a directly-callable POST endpoint, not only
reachable through the rendered `<form>`. It currently does only shape
validation (`ContactFormSchema.safeParse`: name/email format, message
10-500 chars) before forwarding to a third-party form backend
(`process.env.BASIN_ENDPOINT`, a Basin form-handling service). There is no
rate limiting, no honeypot, and no other abuse-prevention — a scripted
client can call the action repeatedly, spamming the site owner's inbox
and/or exhausting their Basin quota. This risk is inherited by every project
that installs `portfolio-v1` via the shadcn CLI, with no mitigation or
guidance shipped in the template.

Separately, `contact-form.tsx` only disables the submit *button* while the
action is pending (`useFormStatus().pending`) — the `name`/`email` inputs
and the surrounding `<fieldset>` stay fully interactive, so pressing Enter
inside an input while a submission is in flight fires `handleSubmit` again
concurrently, sending a duplicate request to Basin for a single user
interaction. This plan fixes both in one pass since they're the same
file/root cause (the action has no guard against redundant or automated
calls).

A full distributed rate limiter (Redis/Upstash-backed) is deliberately out
of scope — it would add a new runtime dependency to a template meant to
stay minimal and self-contained, and in-memory rate limiting doesn't work
reliably across serverless cold starts/multiple instances anyway. This plan
uses a honeypot field (standard, dependency-free spam mitigation) plus a
documented recommendation for production deployments to add a real rate
limiter in front of the action if they need one.

## Current state

- `registry/new-york/templates/portfolio-v1/lib/schemas.ts` — full current content:

```ts
import { z } from "zod"

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email."),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must be less than 500 characters." }),
})
```

- `registry/new-york/templates/portfolio-v1/lib/actions.ts` — full current content:

```ts
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
```

- `registry/new-york/templates/portfolio-v1/components/contact-form.tsx` — full current content:

```tsx
"use client"

import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { contactFormAction } from "../lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner data-icon="inline-start" />
          Sending...
        </>
      ) : (
        "Send message"
      )}
    </Button>
  )
}

export function ContactForm() {
  async function handleSubmit(formData: FormData) {
    const result = await contactFormAction(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.success) {
      toast.success("Message sent successfully!")
    }
  }

  return (
    <form action={handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Project details, timeline, and anything else I should know..."
              required
            />
          </Field>
          <Field orientation="horizontal">
            <SubmitButton />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
```

- `registry/new-york/templates/portfolio-v1/components/ui/field.tsx`'s
  `FieldSet` (confirmed): renders a plain native `<fieldset {...props} />`
  and forwards all props — so passing `disabled={pending}` to `FieldSet`
  works via standard HTML `<fieldset disabled>` semantics (it disables every
  descendant form control automatically; you do not need to add `disabled`
  to each `Input`/`Textarea` individually).

- **Repo test convention**: `tests/wordle/actions.test.ts` is the closest
  exemplar for testing a server action in this repo (`describe`/`it` blocks,
  no mocking framework beyond vitest's own `vi`). Model the new test file
  after its structure.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|---------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                      | exit 0, no errors   |
| Tests     | `pnpm test:run`                       | all pass            |
| Lint      | `pnpm lint`                           | exit 0              |
| Registry  | `pnpm registry:validate`              | exit 0              |

## Scope

**In scope**:
- `registry/new-york/templates/portfolio-v1/lib/actions.ts`
- `registry/new-york/templates/portfolio-v1/components/contact-form.tsx`
- `tests/templates/portfolio-v1/actions.test.ts` (create)

**Out of scope**:
- `registry/new-york/templates/portfolio-v1/lib/schemas.ts` — the honeypot
  field is intentionally handled outside the zod schema (see Step 1) so it
  never appears as a user-facing validation error; do not add it here.
- Adding any new npm dependency (rate limiter, CAPTCHA library, etc.) — not
  needed for this plan's fix and would add weight to a template meant to
  stay minimal.
- `registry.json` — no new files are being added (the honeypot input lives
  inside the existing `contact-form.tsx`), so no registry entry changes are
  needed. If your implementation does add a new file, stop and reconsider —
  that's a sign you've gone beyond this plan's intended scope.
- `portfolio-v2` — it has no contact form; this plan is `portfolio-v1`-only.

## Git workflow

- Branch: `advisor/019-harden-contact-form-action`
- Commit per step or per logical unit.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add a honeypot check to `contactFormAction`

In `lib/actions.ts`, read a `company` field from `formData` *before* the
zod validation and short-circuit with a fake success if it's non-empty
(never reveal to a bot that it was caught):

```ts
"use server"

import { ContactFormSchema } from "./schemas"

export async function contactFormAction(formData: FormData) {
  // Honeypot: real users never see or fill this field (hidden + off-screen
  // in the form). Bots that auto-fill every field will trip it.
  const honeypot = String(formData.get("company") ?? "").trim()
  if (honeypot !== "") {
    return { success: true as const }
  }

  const endpoint = process.env.BASIN_ENDPOINT
  // ...rest unchanged...
```

**Verify**: `pnpm typecheck` → exit 0, no errors.

### Step 2: Add the honeypot input to the form, hidden from real users

In `contact-form.tsx`, add a hidden input inside `<FieldSet>` (anywhere
before the closing tag is fine, e.g. right after the opening `<FieldSet>`):

```tsx
<input
  type="text"
  name="company"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  className="absolute left-[-9999px] h-px w-px opacity-0"
/>
```

Positioning it off-screen (rather than `display:none`, which some spam bots
specifically detect and skip) is the standard honeypot pattern — keep this
exact approach rather than substituting `hidden` or `display:none`.

**Verify**: `pnpm typecheck` → exit 0. `pnpm lint` → exit 0 (confirms no
accessibility-lint complaints about the hidden input).

### Step 3: Prevent double-submit by disabling the fieldset while pending

Change `ContactForm` to read `pending` at the top level (via a small wrapper
so both the fieldset and the button can use it) instead of only inside
`SubmitButton`:

```tsx
function ContactFields() {
  const { pending } = useFormStatus()

  return (
    <FieldSet disabled={pending}>
      <FieldGroup>
        {/* honeypot input from Step 2 stays here */}
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" placeholder="Your name" required autoComplete="name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="your.email@example.com" required autoComplete="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" name="message" rows={5} placeholder="Project details, timeline, and anything else I should know..." required />
        </Field>
        <Field orientation="horizontal">
          <SubmitButton />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export function ContactForm() {
  async function handleSubmit(formData: FormData) {
    const result = await contactFormAction(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.success) {
      toast.success("Message sent successfully!")
    }
  }

  return (
    <form action={handleSubmit}>
      <ContactFields />
    </form>
  )
}
```

`useFormStatus` must be called from a component rendered *inside* the
`<form>` (same rule that already applies to `SubmitButton` — that's why a
new `ContactFields` wrapper is needed rather than reading `pending` directly
in `ContactForm`, which renders the `<form>` element itself and is outside
its own status scope).

**Verify**: `pnpm typecheck` → exit 0.

### Step 4: Add tests for `contactFormAction`

Create `tests/templates/portfolio-v1/actions.test.ts`:

```ts
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
```

Model this file's structure (imports, `describe`/`it`, assertion style)
after `tests/wordle/actions.test.ts`. `vi.stubGlobal`/`vi.unstubAllGlobals`
are vitest built-ins — no new dependency is needed to mock `fetch`.

**Verify**: `pnpm test:run` → all pass, including the 6 new tests.

## Test plan

- New tests in `tests/templates/portfolio-v1/actions.test.ts`: missing
  endpoint, validation failure (no fetch call), honeypot triggered (no
  fetch call, fake success), happy path (fetch called with correct
  URL/method, returns success), non-OK response, network error.
- Structural pattern: `tests/wordle/actions.test.ts`.
- Verification: `pnpm test:run` → all pass, including 6 new tests.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm test:run` exits 0; the 6 new tests exist and pass
- [ ] `pnpm lint` exits 0
- [ ] `pnpm registry:validate` exits 0
- [ ] `grep -n "honeypot\|company" registry/new-york/templates/portfolio-v1/lib/actions.ts` returns a match
- [ ] `grep -n "disabled={pending}" registry/new-york/templates/portfolio-v1/components/contact-form.tsx` returns a match
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code at the cited locations doesn't match the excerpts above (drift
  since this plan was written).
- A step's verification fails twice after a reasonable fix attempt.
- `FieldSet` does not actually forward `disabled` to a native `<fieldset>`
  element when you re-check `components/ui/field.tsx` (this plan assumes it
  does, confirmed at planning time — if that's changed, the double-submit
  fix needs a different approach; stop and report rather than inventing one).
- You find `BASIN_ENDPOINT` or any other real credential value anywhere
  while working — do not paste it into any file, commit, or report; note
  only that a credential was found, its type, and its file:line.

## Maintenance notes

- The template's `.env.example` or README should mention that production
  deployments handling meaningful volumes of traffic may still want a real
  rate limiter (e.g. Vercel Firewall, Upstash) in front of the action — this
  plan's honeypot is a lightweight first line of defense, not a complete
  solution. Adding that doc note is a nice-to-have if you have time left in
  this plan's effort budget, but not a done-criterion.
- If `portfolio-v1` ever gains a second form (e.g. a newsletter signup),
  apply the same honeypot + fieldset-disable pattern from the start.
