import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/landing-page-v2/app/page"
import RegisterPage from "@/registry/new-york/templates/landing-page-v2/app/register/page"
import { Toaster } from "@/registry/new-york/templates/landing-page-v2/components/ui/toast"

// Preview doesn't mount the template layout — pull in globals so hero-reveal
// and theme tokens match an installed copy.
import "@/registry/new-york/templates/landing-page-v2/app/globals.css"

function Page({ slug }: { slug: string[] }) {
  if (slug.length === 0) return <HomePage />
  if (slug.length === 1 && slug[0] === "register") return <RegisterPage />
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

  // Preview skips ThemeProvider (would fight the host <html> class). Force
  // dark tokens here; installed apps use the template layout ThemeProvider.
  return (
    <TemplatePreviewNav basePath={basePath}>
      <Toaster>
        <div className="dark flex min-h-svh flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
          {children}
        </div>
      </Toaster>
    </TemplatePreviewNav>
  )
}

export const landingPageV2Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => [{ slug: [] }, { slug: ["register"] }],
}
