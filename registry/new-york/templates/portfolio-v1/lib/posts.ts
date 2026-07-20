import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ComponentType } from "react"

export type ContentFrontmatter = {
  title: string
  description?: string
  date: string
  published?: boolean
}

export type ContentEntry = {
  slug: string
  title: string
  description?: string
  date: string
  body: ComponentType
}

const TEMPLATE_CONTENT_FALLBACK = path.join(
  process.cwd(),
  "registry/new-york/templates/portfolio-v1/content"
)

async function resolveContentDir(kind: "writing" | "books"): Promise<string | null> {
  const candidates = [
    path.join(process.cwd(), "content", kind),
    path.join(TEMPLATE_CONTENT_FALLBACK, kind),
  ]

  for (const dir of candidates) {
    try {
      await fs.access(dir)
      return dir
    } catch {
      // try next
    }
  }
  return null
}

function normalizeDate(date: unknown): string {
  // gray-matter parses unquoted YAML dates (e.g. `date: 2025-09-20`) into Date objects.
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10)
  }
  return String(date).slice(0, 10)
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatContentDate(dateStr: string): string {
  return formatDate(dateStr)
}

async function loadEntries(kind: "writing" | "books"): Promise<ContentEntry[]> {
  const directory = await resolveContentDir(kind)
  if (!directory) return []

  let filenames: string[] = []
  try {
    filenames = await fs.readdir(directory)
  } catch {
    return []
  }

  const mdxFiles = filenames.filter((filename) => filename.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (filename) => {
      const fullPath = path.join(directory, filename)
      const source = await fs.readFile(fullPath, "utf8")
      const { data, content } = matter(source)
      const frontmatter = data as ContentFrontmatter

      if (frontmatter.published === false) {
        return null
      }

      const compiled = await compileMDX<ContentFrontmatter>({
        source: content,
        options: {
          parseFrontmatter: false,
        },
      })
      const Body = () => compiled.content

      const entry: ContentEntry = {
        slug: filename.replace(/\.mdx$/, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        date: normalizeDate(frontmatter.date),
        body: Body,
      }
      return entry
    })
  )

  return entries
    .filter((entry): entry is ContentEntry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getWriting(): Promise<ContentEntry[]> {
  return loadEntries("writing")
}

export async function getWritingEntry(slug: string): Promise<ContentEntry | null> {
  const entries = await getWriting()
  return entries.find((entry) => entry.slug === slug) ?? null
}

export async function getBooks(): Promise<ContentEntry[]> {
  return loadEntries("books")
}

export async function getBook(slug: string): Promise<ContentEntry | null> {
  const books = await getBooks()
  return books.find((book) => book.slug === slug) ?? null
}
