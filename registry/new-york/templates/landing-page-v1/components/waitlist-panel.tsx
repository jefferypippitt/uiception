"use client"

import { Waitlist } from "@clerk/nextjs"
import { useState, type FormEvent } from "react"

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

const panelClassName =
  "w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm"

/**
 * Renders Clerk's prebuilt <Waitlist /> (shadcn theme is applied at the
 * ClerkProvider level in app/layout.tsx). Until Clerk keys are set in
 * .env.local, a local demo form renders instead so the page works on
 * first run — it does not store emails anywhere.
 */
export function WaitlistPanel() {
  if (!clerkEnabled) {
    return <WaitlistDemoForm />
  }

  return <Waitlist fallback={<WaitlistSkeleton />} />
}

function WaitlistDemoForm() {
  const [joined, setJoined] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setJoined(true)
  }

  return (
    <div className={panelClassName}>
      {joined ? (
        <div className="flex flex-col items-center py-8 text-center">
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
          >
            ✓
          </span>
          <h2 className="mt-4 text-lg font-semibold text-card-foreground">
            You&apos;re on the list
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll email you when your spot is ready.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-card-foreground">
            Join the waitlist
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email address and we&apos;ll let you know when your spot
            is ready.
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <label
              htmlFor="waitlist-email"
              className="text-sm font-medium text-card-foreground"
            >
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              className="h-9 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Join the waitlist
            </button>
          </form>
        </>
      )}
    </div>
  )
}

function WaitlistSkeleton() {
  return (
    <div className={panelClassName}>
      <div className="h-5 w-2/5 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-4 w-4/5 animate-pulse rounded-md bg-muted" />
      <div className="mt-6 h-9 w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-9 w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
