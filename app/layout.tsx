import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
} from "geist/font/pixel"
import { IBM_Plex_Serif, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"


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
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.metaDescription,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  applicationName: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.metaDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 1064,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.metaDescription,
    images: [siteConfig.ogImage],
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
          ibmPlexSerif.variable,
          instrumentSerif.variable,
          "font-sans",
        )}
      >
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: siteConfig.url,
                description: siteConfig.metaDescription,
                author: {
                  "@type": "Person",
                  name: siteConfig.author.name,
                  url: siteConfig.author.url,
                },
              }),
            }}
          />
          <Providers>{children}</Providers>
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
  )
}
