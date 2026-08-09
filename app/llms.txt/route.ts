import { blockCategories } from "@/lib/blocks"
import { siteConfig } from "@/lib/config"
import { templateCategories } from "@/lib/templates"

export async function GET() {
  const blockLines = blockCategories
    .filter((category) => category.versions.length > 0)
    .map((category) => {
      const count = category.versions.length
      const label = `${count} version${count === 1 ? "" : "s"}`
      return `- [${category.title}](${siteConfig.url}/blocks/${category.id}): ${label}`
    })
    .join("\n")

  const templateLines = templateCategories
    .filter((category) => category.versions.length > 0)
    .map((category) => {
      const count = category.versions.length
      const label = `${count} version${count === 1 ? "" : "s"}`
      return `- [${category.title}](${siteConfig.url}/templates/${category.id}): ${label}`
    })
    .join("\n")

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.metaDescription} The full catalog is available as machine-readable JSON at ${siteConfig.url}/r/registry.json, and each block or template can be installed directly with \`npx shadcn@latest add ${siteConfig.url}/r/<name>.json\`.

## Blocks

${blockLines}

## Templates

${templateLines}

## Docs

- [Docs](${siteConfig.url}/docs)
- [Changelog](${siteConfig.url}/changelog)
- [RSS Feed](${siteConfig.url}/rss.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
