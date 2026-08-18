import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/landing-page-v2/app/page"
import RegisterPage from "@/registry/new-york/templates/landing-page-v2/app/register/page"
import { GlowCanvas } from "@/registry/new-york/templates/landing-page-v2/components/glow-canvas"
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
  //
  // This Frame is rendered by app/(preview)/view/[versionId]/layout.tsx, a
  // real layout route segment, so GlowCanvas here persists across the
  // home <-> register preview nav the same way it does via the template's
  // own app/layout.tsx in an installed copy — it must never live inside
  // `children` (Page), or it'd remount/blink on every nav.
  //
  // `children` (HomePage/RegisterPage) stacks above the canvas via its
  // own <main className="relative z-10">.
  return (
    <TemplatePreviewNav basePath={basePath}>
      <Toaster>
        <div className="dark flex min-h-svh flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20">
          <div className="glow-canvas-vt fixed inset-0 z-0 bg-black">
            <GlowCanvas />
          </div>
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
