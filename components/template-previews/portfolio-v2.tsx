import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/portfolio-v2/app/page"
import NotesIndexPage from "@/registry/new-york/templates/portfolio-v2/app/notes/page"
import NotePage, {
  generateStaticParams as generateNoteParams,
} from "@/registry/new-york/templates/portfolio-v2/app/notes/[slug]/page"
import { LiquidShell } from "@/registry/new-york/templates/portfolio-v2/components/liquid-shell"

function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["notes"] },
    ...generateNoteParams().map(({ slug }) => ({ slug: ["notes", slug] })),
  ]
}

async function Page({ slug }: { slug: string[] }) {
  if (slug.length === 0) {
    return <HomePage />
  }

  const [section, entry] = slug

  if (section === "notes" && slug.length === 1) {
    return <NotesIndexPage />
  }

  if (section === "notes" && slug.length === 2 && entry) {
    return <NotePage params={Promise.resolve({ slug: entry })} />
  }

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
      {/*
        Uses the host site's ThemeProvider (same as portfolio-v1 preview).
        LiquidShell reads resolvedTheme and retunes trail color for light/dark.
      */}
      <div className="flex min-h-svh flex-col font-sans antialiased">
        <LiquidShell>
          <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-1 flex-col px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </LiquidShell>
      </div>
    </TemplatePreviewNav>
  )
}

export const portfolioV2Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => generateStaticParams(),
}
