import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/landing-page-v1/app/page"

// Mirrors the template's own layout: without a Clerk publishable key the page
// falls back to its keyless demo form, so the provider is skipped too.
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

function Page({ slug }: { slug: string[] }) {
  if (slug.length > 0) notFound()
  return <HomePage />
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
  const content = (
    <TemplatePreviewNav basePath={basePath}>
      <div className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
        {children}
      </div>
    </TemplatePreviewNav>
  )

  if (!clerkEnabled) return content

  return (
    <ClerkProvider
      appearance={{ theme: shadcn }}
      waitlistUrl={basePath}
      signInFallbackRedirectUrl={basePath}
      signUpFallbackRedirectUrl={basePath}
    >
      {content}
    </ClerkProvider>
  )
}

export const landingPageV1Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => [{ slug: [] }],
}
