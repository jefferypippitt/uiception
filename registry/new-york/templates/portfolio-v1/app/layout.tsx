import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "../components/ui/sonner"

import "katex/dist/katex.min.css"
import "./globals.css"
import "./typeset.css"
import "../styles/typeset-article.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "John Doe",
  description:
    "Physicist and science communicator. Planetary science, the solar system, and public writing about how the universe works.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
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
