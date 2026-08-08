import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { site } from "../lib/site"

import "./globals.css"

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.tagline,
}

// The page renders a keyless demo form until Clerk keys are set in .env.local,
// so the provider is skipped too (ClerkProvider throws without a publishable key).
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col bg-background font-sans text-foreground">
        {clerkEnabled ? (
          // waitlistUrl points at "/" because <Waitlist /> is on the home page.
          // Fallback redirects send invite-accept / sign-in back here (override
          // via NEXT_PUBLIC_CLERK_SIGN_*_FALLBACK_REDIRECT_URL once you add /dashboard).
          <ClerkProvider
            appearance={{ theme: shadcn }}
            waitlistUrl="/"
            signInFallbackRedirectUrl="/"
            signUpFallbackRedirectUrl="/"
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
