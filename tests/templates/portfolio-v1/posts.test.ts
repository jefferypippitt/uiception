import { describe, expect, it } from "vitest"
import {
  getBook,
  getBooks,
  getWriting,
  getWritingEntry,
  parseFrontmatter,
} from "@/registry/new-york/templates/portfolio-v1/lib/posts"

describe("parseFrontmatter", () => {
  it("accepts valid frontmatter with a string date", () => {
    const result = parseFrontmatter({ title: "Hello", date: "2026-01-15" })
    expect(result).toEqual({
      ok: true,
      data: { title: "Hello", description: undefined, date: "2026-01-15", published: undefined },
    })
  })

  it("accepts valid frontmatter with a Date object (gray-matter's unquoted-YAML-date behavior)", () => {
    const result = parseFrontmatter({ title: "Hello", date: new Date(Date.UTC(2026, 0, 15)) })
    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error("unreachable")
    expect(result.data.date).toBe("2026-01-15")
  })

  it("rejects frontmatter missing a title", () => {
    const result = parseFrontmatter({ date: "2026-01-15" })
    expect(result.ok).toBe(false)
  })

  it("rejects frontmatter missing a date", () => {
    const result = parseFrontmatter({ title: "Hello" })
    expect(result.ok).toBe(false)
  })

  it("rejects frontmatter with an empty title", () => {
    const result = parseFrontmatter({ title: "", date: "2026-01-15" })
    expect(result.ok).toBe(false)
  })
})

describe("content pipeline integration (real shipped fixture content)", () => {
  it("getWriting returns all 4 published writing posts, sorted newest first", async () => {
    const entries = await getWriting()
    expect(entries).toHaveLength(4)
    const dates = entries.map((e) => e.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("getBooks returns both books", async () => {
    const books = await getBooks()
    expect(books).toHaveLength(2)
  })

  it("getWritingEntry returns the matching post by slug", async () => {
    const entry = await getWritingEntry("rip-pluto")
    expect(entry).not.toBeNull()
    expect(entry?.title).toBeTruthy()
    expect(entry?.date).toBe("2026-05-18")
  })

  it("getWritingEntry returns null for an unknown slug", async () => {
    const entry = await getWritingEntry("does-not-exist")
    expect(entry).toBeNull()
  })

  it("getBook returns the matching book by slug", async () => {
    const book = await getBook("why-anything-happens")
    expect(book).not.toBeNull()
    expect(book?.date).toBe("2025-09-20")
  })
})
