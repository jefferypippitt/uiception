import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel"
import "./globals.css"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers"
import { ViewTransitions } from "next-view-transitions"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          GeistSans.variable,
          GeistMono.variable,
          GeistPixelSquare.variable,
          GeistPixelGrid.variable,
          GeistPixelCircle.variable,
          GeistPixelTriangle.variable,
          GeistPixelLine.variable,
          "font-sans",
        )}
      >
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
