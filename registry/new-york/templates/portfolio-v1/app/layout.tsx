import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"

import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "../components/ui/sonner"

import "./globals.css"
import "./typeset.css"
import "../styles/typeset-article.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "John Doe",
  description:
    "Physicist and science communicator. Planetary science, the solar system, and clear public writing about how the universe works.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable} suppressHydrationWarning>
      <body className="min-h-svh bg-background font-mono text-foreground antialiased">
        <ThemeProvider>
          <div className="mx-auto w-full max-w-[90ch] px-6 py-16 md:py-24">
            <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
