import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/portfolio-v4/app/page"

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

  // Preview skips ThemeProvider (host already has one).
  return (
    <TemplatePreviewNav basePath={basePath}>
      <div className="min-h-svh antialiased">{children}</div>
    </TemplatePreviewNav>
  )
}

export const portfolioV4Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => [{ slug: [] }],
}
