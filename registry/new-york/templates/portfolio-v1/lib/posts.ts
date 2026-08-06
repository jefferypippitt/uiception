import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ComponentType } from "react"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { z } from "zod"

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

const ContentFrontmatterSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  description: z.string().optional(),
  date: z.union([z.string(), z.date()]),
  published: z.boolean().optional(),
})

export type FrontmatterParseResult =
  | { ok: true; data: ContentFrontmatter }
  | { ok: false; error: string }

/**
 * Pure — takes raw frontmatter data (already parsed by gray-matter) and
 * validates it. Kept separate from file I/O so it can be unit tested
 * without touching the filesystem.
 */
export function parseFrontmatter(raw: unknown): FrontmatterParseResult {
  const result = ContentFrontmatterSchema.safeParse(raw)
  if (!result.success) {
    return { ok: false, error: result.error.issues[0]?.message ?? "Invalid frontmatter." }
  }
  return {
    ok: true,
    data: {
      title: result.data.title,
      description: result.data.description,
      date: normalizeDate(result.data.date),
      published: result.data.published,
    },
  }
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
      try {
        const fullPath = path.join(directory, filename)
        const source = await fs.readFile(fullPath, "utf8")
        const { data, content } = matter(source)

        const parsed = parseFrontmatter(data)
        if (!parsed.ok) {
          console.warn(`[content] skipping ${kind}/${filename}: ${parsed.error}`)
          return null
        }
        const frontmatter = parsed.data

        if (frontmatter.published === false) {
          return null
        }

        const compiled = await compileMDX<ContentFrontmatter>({
          source: content,
          options: {
            parseFrontmatter: false,
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          },
        })
        const Body = () => compiled.content

        const entry: ContentEntry = {
          slug: filename.replace(/\.mdx$/, ""),
          title: frontmatter.title,
          description: frontmatter.description,
          date: frontmatter.date,
          body: Body,
        }
        return entry
      } catch (error) {
        console.warn(`[content] skipping ${kind}/${filename}: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
    })
  )

  return entries
    .filter((entry): entry is ContentEntry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

async function loadEntry(kind: "writing" | "books", slug: string): Promise<ContentEntry | null> {
  const directory = await resolveContentDir(kind)
  if (!directory) return null

  const filename = `${slug}.mdx`
  const fullPath = path.join(directory, filename)

  let source: string
  try {
    source = await fs.readFile(fullPath, "utf8")
  } catch {
    return null
  }

  const { data, content } = matter(source)
  const parsed = parseFrontmatter(data)
  if (!parsed.ok) {
    console.warn(`[content] ${kind}/${filename}: ${parsed.error}`)
    return null
  }
  const frontmatter = parsed.data
  if (frontmatter.published === false) return null

  try {
    const compiled = await compileMDX<ContentFrontmatter>({
      source: content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    })
    const Body = () => compiled.content

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      body: Body,
    }
  } catch (error) {
    console.warn(`[content] ${kind}/${filename}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

export async function getWriting(): Promise<ContentEntry[]> {
  return loadEntries("writing")
}

export async function getWritingEntry(slug: string): Promise<ContentEntry | null> {
  return loadEntry("writing", slug)
}

export async function getBooks(): Promise<ContentEntry[]> {
  return loadEntries("books")
}

export async function getBook(slug: string): Promise<ContentEntry | null> {
  return loadEntry("books", slug)
}
