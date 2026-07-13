import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ComponentType } from "react"

import { blockCategories } from "@/lib/blocks"

type ChangelogItem = {
  name: string
  label: string
  href?: string
}

type ChangelogItemInput = string | ChangelogItem

type ChangelogFrontmatter = {
  title: string
  summary?: string
  description?: string
  date: string | Date
  items?: ChangelogItemInput[]
}

export type ChangelogEntry = {
  title: string
  summary?: string
  description?: string
  date: string
  dateDisplay: string
  items: ChangelogItem[]
  body: ComponentType
}

const changelogDirectory = path.join(process.cwd(), "content", "changelog")

function parseDate(date: string) {
  const parsed = new Date(date)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }

  return new Date(0)
}

function formatDateDisplay(dateStr: string): string {
  // Parse YYYY-MM-DD as UTC to avoid timezone-shift issues
  const [year, month, day] = dateStr.split("-").map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formatItemLabel(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function inferItemHref(name: string) {
  for (const category of blockCategories) {
    if (category.versions.some((v) => v.id === name)) {
      return `/blocks/${category.id}#${name}`
    }
  }
  const categoryId = name.replace(/-v\d+$/i, "")
  return `/blocks/${categoryId}#${name}`
}

function normalizeItems(items: ChangelogItemInput[] | undefined): ChangelogItem[] {
  if (!items || items.length === 0) {
    return []
  }

  return items.map((item) => {
    if (typeof item === "string") {
      return {
        name: item,
        label: formatItemLabel(item),
        href: inferItemHref(item),
      }
    }

    return {
      name: item.name,
      label: item.label,
      href: item.href,
    }
  })
}

export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
  let filenames: string[] = []

  try {
    filenames = await fs.readdir(changelogDirectory)
  } catch {
    return []
  }

  const mdxFiles = filenames.filter((filename) => filename.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (filename) => {
      const fullPath = path.join(changelogDirectory, filename)
      const source = await fs.readFile(fullPath, "utf8")
      const { data, content } = matter(source)
      const frontmatter = data as ChangelogFrontmatter
      const compiled = await compileMDX<ChangelogFrontmatter>({
        source: content,
        options: { parseFrontmatter: false },
      })
      const Body = () => compiled.content

      const dateStr = frontmatter.date instanceof Date
        ? frontmatter.date.toISOString().slice(0, 10)
        : String(frontmatter.date)

      return {
        title: frontmatter.title,
        summary: frontmatter.summary,
        description: frontmatter.description,
        date: dateStr,
        dateDisplay: formatDateDisplay(dateStr),
        items: normalizeItems(frontmatter.items),
        body: Body,
      } satisfies ChangelogEntry
    })
  )

  return entries.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
}
