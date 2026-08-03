import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { LiquidShell } from "../components/liquid-shell"
import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Jon Doe",
  description:
    "Fullstack developer. Building clear systems and shipping software that stays easy to maintain.",
}

// Same pattern as canvasui.dev — Origin Trial meta (no chrome://flags needed).
// One token from https://developer.chrome.com/origintrials for your site origin.
const ORIGIN_TRIAL_TOKEN =
  process.env.NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN ?? ""

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full ${GeistSans.variable} antialiased`}
      suppressHydrationWarning
    >
      {ORIGIN_TRIAL_TOKEN ? (
        <head>
          <meta httpEquiv="origin-trial" content={ORIGIN_TRIAL_TOKEN} />
        </head>
      ) : null}
      <body
        className={`${GeistSans.className} flex min-h-svh flex-col bg-background font-sans text-foreground`}
      >
        <ThemeProvider>
          <LiquidShell>
            <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-1 flex-col px-6 py-12 md:px-12 md:py-16 lg:px-16">
              <main className="flex flex-1 flex-col">{children}</main>
            </div>
          </LiquidShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
