import type { Metadata } from "next"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlockPreviewToolbar } from "@/components/block-preview-toolbar"
import { Button } from "@/components/ui/button"
import { blockCategories } from "@/lib/blocks"
import { getBlockRegistryData } from "@/lib/registry-server"

import { CategoryHashScroll } from "@/components/category-hash-scroll"

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return blockCategories.map((category) => ({ category: category.id }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = blockCategories.find((item) => item.id === category)
  if (!categoryData) return {}
  return {
    title: categoryData.title,
    description: categoryData.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = blockCategories.find((item) => item.id === category)

  if (!categoryData) {
    notFound()
  }

  const registryDataMap = Object.fromEntries(
    await Promise.all(
      categoryData.versions.map(async (version) => [
        version.id,
        await getBlockRegistryData(version.id),
      ])
    )
  )

  return (
    <div className="pb-14 md:pb-20">
      <CategoryHashScroll />
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl tracking-tighter md:text-4xl">
            {categoryData.title}
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/blocks">
              <ChevronLeftIcon data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>

        {categoryData.versions.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No blocks available yet.</p>
        ) : (
          <div className="mt-8 space-y-16">
            {categoryData.versions.map((version) => (
              <section
                key={version.id}
                id={version.id}
                className="scroll-mt-24"
              >
                <BlockPreviewToolbar
                  version={version}
                  registryData={registryDataMap[version.id] ?? null}
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
