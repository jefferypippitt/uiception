import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import type { ReactNode } from "react"

import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Jon Doe",
  description:
    "Fullstack developer — type about, work, resume, or help in the terminal.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${GeistMono.variable} m-0 min-h-full overflow-x-hidden p-0 font-mono antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
