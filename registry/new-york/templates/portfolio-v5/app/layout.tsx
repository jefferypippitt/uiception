import type { Metadata, Viewport } from "next"
import { Oxanium } from "next/font/google"
import type { ReactNode } from "react"

import { BlackHole } from "../components/black-hole"

import "./globals.css"

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

export const metadata: Metadata = {
  title: "Jon Doe",
  description:
    "Fullstack developer — about and projects over a WebGPU black hole.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#000000",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative m-0 min-h-svh overflow-x-hidden bg-black p-0 font-sans text-base text-white antialiased">
        <div
          className="fixed inset-0 z-0 overflow-hidden bg-black"
          aria-hidden
        >
          <BlackHole />
        </div>
        {children}
      </body>
    </html>
  )
}
