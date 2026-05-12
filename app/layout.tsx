import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel"
import { IBM_Plex_Serif, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { ViewTransitions } from "next-view-transitions"
import { Analytics } from "@vercel/analytics/next"

const ogImagePath = new URL(siteConfig.ogImage).pathname

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL!,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}${ogImagePath}`,
        width: 512,
        height: 512,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${process.env.NEXT_PUBLIC_APP_URL}${ogImagePath}`],
    creator: "@jefferypippitt",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "96x96", type: "image/png" },
      { url: "/icon_192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon_512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
}

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
          ibmPlexSerif.variable,
          instrumentSerif.variable,
          "font-sans",
        )}
      >
        <body>
          <Providers>{children}</Providers>
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  )
}
