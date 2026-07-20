import { blockCategories } from "@/lib/blocks"
import { siteConfig } from "@/lib/config"
import { templateCategories } from "@/lib/templates"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blocks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/changelog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  const blockCategoryRoutes: MetadataRoute.Sitemap = blockCategories
    .filter((category) => category.versions.length > 0)
    .map((category) => ({
      url: `${siteConfig.url}/blocks/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

  const templateCategoryRoutes: MetadataRoute.Sitemap = templateCategories.map(
    (category) => ({
      url: `${siteConfig.url}/templates/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  )

  return [...staticRoutes, ...blockCategoryRoutes, ...templateCategoryRoutes]
}
