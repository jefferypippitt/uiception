import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Jon Doe",
  description:
    "Fullstack developer — a scroll-scrubbed timeline of sites shipped and teams joined.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full ${GeistSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`${GeistSans.className} flex min-h-svh flex-col bg-background font-sans text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
