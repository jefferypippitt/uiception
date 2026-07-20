import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ComponentType } from "react"

type DocFrontmatter = {
  title: string
  description?: string
  order?: number
}

export type DocEntry = {
  slug: string
  title: string
  description?: string
  order: number
  body: ComponentType
}

const docsDirectory = path.join(process.cwd(), "content", "docs")

export async function getDocsEntries(): Promise<DocEntry[]> {
  let filenames: string[] = []

  try {
    filenames = await fs.readdir(docsDirectory)
  } catch {
    return []
  }

  const mdxFiles = filenames.filter((filename) => filename.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (filename) => {
      const fullPath = path.join(docsDirectory, filename)
      const source = await fs.readFile(fullPath, "utf8")
      const { data, content } = matter(source)
      const frontmatter = data as DocFrontmatter
      const compiled = await compileMDX<DocFrontmatter>({
        source: content,
        options: {
          parseFrontmatter: false,
        },
      })
      const Body = () => compiled.content

      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        order: frontmatter.order ?? Number.MAX_SAFE_INTEGER,
        body: Body,
      } satisfies DocEntry
    })
  )

  return entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.slug.localeCompare(b.slug)
  })
}
