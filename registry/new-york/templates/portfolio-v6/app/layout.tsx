import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { GsapAnimation } from "../components/gsap-animation"
import { ProfileHeader } from "../components/profile-header"
import { SiteNav } from "../components/site-nav"
import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Jon Doe",
  description:
    "Fullstack developer — a quiet CV of work, projects, and writing.",
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
        <ThemeProvider>
          <GsapAnimation className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-16 pb-28 sm:px-8 sm:pt-24">
            <ProfileHeader />
            <main className="mt-12 flex flex-1 flex-col">{children}</main>
          </GsapAnimation>
          <SiteNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
