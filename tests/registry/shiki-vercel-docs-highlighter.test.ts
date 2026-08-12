import { describe, expect, it } from "vitest"

import {
  getShikiLangFromPath,
  resolveShikiLang,
  SHIKI_THEME_VERCEL_DARK,
  withVercelDocsHighlighter,
} from "@/lib/shiki-vercel-docs-highlighter"

describe("resolveShikiLang", () => {
  it("keeps mdx as mdx instead of falling back to plaintext", () => {
    expect(resolveShikiLang("mdx")).toBe("mdx")
    expect(resolveShikiLang("md")).toBe("markdown")
  })
})

describe("getShikiLangFromPath", () => {
  it("maps .mdx files to the mdx grammar", () => {
    expect(getShikiLangFromPath("content/writing/rip-pluto.mdx")).toBe("mdx")
    expect(getShikiLangFromPath("app/page.tsx")).toBe("tsx")
    expect(getShikiLangFromPath("styles/typeset-article.css")).toBe("css")
  })
})

describe("mdx highlighting", () => {
  it("applies token colors to JSX in MDX the same way as other grammars", async () => {
    const source = [
      "---",
      "title: RIP Pluto",
      "---",
      "",
      '<img className="grayscale" width={1200} />',
    ].join("\n")

    const html = await withVercelDocsHighlighter((hl) =>
      hl.codeToHtml(source, {
        lang: "mdx",
        theme: SHIKI_THEME_VERCEL_DARK,
      })
    )

    expect(html).toContain("className")
    const colors = new Set(
      [...html.matchAll(/style="color:([^"]+)"/g)].map((match) => match[1])
    )
    expect(colors.size).toBeGreaterThan(3)
  })
})
