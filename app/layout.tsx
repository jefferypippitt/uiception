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
import { IBM_Plex_Serif } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers"
import { ViewTransitions } from "next-view-transitions"

const ogImagePath = new URL(siteConfig.ogImage).pathname

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
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
    icon: "/favicon.ico",
    shortcut: "/icon1.png",
    apple: "/apple-icon.png",
  },
  manifest: `${siteConfig.url}/manifest.json`,
  appleWebApp: {
    title: siteConfig.name,
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
