import { getChangelogEntries } from "@/lib/changelog"
import { siteConfig } from "@/lib/config"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const entries = await getChangelogEntries()

  const items = entries
    .map((entry) => {
      const link = `${siteConfig.url}/changelog#entry-${entry.date}`
      const description = entry.summary ?? entry.description ?? entry.title
      const pubDate = new Date(`${entry.date}T00:00:00Z`).toUTCString()

      return `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)} Changelog</title>
    <link>${escapeXml(siteConfig.url)}/changelog</link>
    <description>${escapeXml(siteConfig.metaDescription)}</description>
    <language>en-us</language>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
