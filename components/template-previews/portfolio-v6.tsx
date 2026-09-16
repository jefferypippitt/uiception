import { notFound } from "next/navigation"
import { GeistSans } from "geist/font/sans"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/portfolio-v6/app/page"
import WritingIndexPage from "@/registry/new-york/templates/portfolio-v6/app/writing/page"
import WritingEntryPage, {
  generateStaticParams as generateWritingParams,
} from "@/registry/new-york/templates/portfolio-v6/app/writing/[slug]/page"
import { GsapAnimation } from "@/registry/new-york/templates/portfolio-v6/components/gsap-animation"
import { ProfileHeader } from "@/registry/new-york/templates/portfolio-v6/components/profile-header"
import { SiteNav } from "@/registry/new-york/templates/portfolio-v6/components/site-nav"

function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["writing"] },
    ...generateWritingParams().map(({ slug }) => ({
      slug: ["writing", slug],
    })),
  ]
}

async function Page({ slug }: { slug: string[] }) {
  if (slug.length === 0) {
    return <HomePage />
  }

  const [section, entry] = slug

  if (section === "writing" && slug.length === 1) {
    return <WritingIndexPage />
  }

  if (section === "writing" && slug.length === 2 && entry) {
    return <WritingEntryPage params={Promise.resolve({ slug: entry })} />
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

  // Preview skips ThemeProvider (host already has one).
  return (
    <TemplatePreviewNav basePath={basePath}>
      <div
        className={`${GeistSans.variable} ${GeistSans.className} flex min-h-svh flex-col bg-background font-sans text-foreground antialiased`}
      >
        <GsapAnimation className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-16 pb-28 sm:px-8 sm:pt-24">
          <ProfileHeader />
          <main className="mt-12 flex flex-1 flex-col">{children}</main>
        </GsapAnimation>
        <SiteNav />
      </div>
    </TemplatePreviewNav>
  )
}

export const portfolioV6Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams: async () => generateStaticParams(),
}
