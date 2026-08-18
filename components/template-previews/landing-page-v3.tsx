import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/landing-page-v3/app/page"

// Preview doesn't mount the template layout — pull in globals so hero-reveal
// and theme tokens match an installed copy. Solari CSS is imported by the board.
import "@/registry/new-york/templates/landing-page-v3/app/globals.css"

function Page({ slug }: { slug: string[] }) {
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

  // Theme tokens match app/globals.css — inherit the host light/dark palette.
  return (
    <TemplatePreviewNav basePath={basePath}>
      <div className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
        {children}
      </div>
    </TemplatePreviewNav>
  )
}

export const landingPageV3Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => [{ slug: [] }],
}
