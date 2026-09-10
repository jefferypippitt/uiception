import { notFound } from "next/navigation"
import { Oxanium } from "next/font/google"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/portfolio-v5/app/page"
import { BlackHole } from "@/registry/new-york/templates/portfolio-v5/components/black-hole"

// The preview reproduces the template shell in <Frame> below (dark class, Oxanium,
// black-hole background). It must NOT import the template's app/globals.css: that file
// is a standalone root stylesheet whose bare `:root`, `html, body` and
// `@theme inline { --font-sans: var(--font-oxanium) }` rules would leak into the host
// build and override every block/template preview's theme tokens and font.

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

async function generateStaticParams() {
  return [{ slug: [] as string[] }]
}

async function Page({ slug }: { slug: string[] }) {
  if (slug.length === 0) return <HomePage />

  notFound()
}

function Frame({
  versionId,
  children,
}: {
  versionId: string
  children: ReactNode
}) {
  const basePath = `/view/${versionId}`

  return (
    <TemplatePreviewNav basePath={basePath}>
      <div
        className={`${oxanium.variable} ${oxanium.className} relative dark min-h-svh overflow-x-hidden bg-black text-base text-white antialiased`}
      >
        <div
          className="fixed inset-0 z-0 overflow-hidden bg-black"
          aria-hidden
        >
          <BlackHole />
        </div>
        {children}
      </div>
    </TemplatePreviewNav>
  )
}

export const portfolioV5Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams,
}
