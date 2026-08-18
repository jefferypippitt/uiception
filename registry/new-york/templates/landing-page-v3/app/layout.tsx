import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { site } from "../lib/site"

import "./globals.css"

export const metadata: Metadata = {
  title: `${site.headline} ${site.name}`,
  description: `${site.headline} ${site.name}`,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}
