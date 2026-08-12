import { notFound } from "next/navigation"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

import { TemplatePreviewNav } from "@/components/template-previews/preview-nav"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import HomePage from "@/registry/new-york/templates/portfolio-v1/app/page"
import BooksIndexPage from "@/registry/new-york/templates/portfolio-v1/app/books/page"
import BookPage, {
  generateStaticParams as generateBookParams,
} from "@/registry/new-york/templates/portfolio-v1/app/books/[slug]/page"
import ContactPage from "@/registry/new-york/templates/portfolio-v1/app/contact/page"
import WritingIndexPage from "@/registry/new-york/templates/portfolio-v1/app/writing/page"
import WritingEntryPage, {
  generateStaticParams as generateWritingParams,
} from "@/registry/new-york/templates/portfolio-v1/app/writing/[slug]/page"
import { Toaster } from "@/registry/new-york/templates/portfolio-v1/components/ui/sonner"

import "@/registry/new-york/templates/portfolio-v1/app/typeset.css"
import "@/registry/new-york/templates/portfolio-v1/styles/typeset-article.css"
import "katex/dist/katex.min.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

async function generateStaticParams() {
  const [writing, books] = await Promise.all([
    generateWritingParams(),
    generateBookParams(),
  ])

  return [
    { slug: [] },
    { slug: ["writing"] },
    { slug: ["books"] },
    { slug: ["contact"] },
    ...writing.map(({ slug }) => ({ slug: ["writing", slug] })),
    ...books.map(({ slug }) => ({ slug: ["books", slug] })),
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

  if (section === "books" && slug.length === 1) {
    return <BooksIndexPage />
  }

  if (section === "books" && slug.length === 2 && entry) {
    return <BookPage params={Promise.resolve({ slug: entry })} />
  }

  if (section === "contact" && slug.length === 1) {
    return <ContactPage />
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
      <div
        className={`${inter.variable} ${inter.className} min-h-svh bg-background text-foreground`}
      >
        <div className="mx-auto w-full max-w-[90ch] px-6 py-16 md:py-24">
          <main>{children}</main>
        </div>
        <Toaster />
      </div>
    </TemplatePreviewNav>
  )
}

export const portfolioV1Preview: TemplatePreviewDefinition = {
  Frame,
  Page,
  generateStaticParams,
}
