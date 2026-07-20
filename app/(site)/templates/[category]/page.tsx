import type { Metadata } from "next"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlockPreviewToolbar } from "@/components/block-preview-toolbar"
import { Button } from "@/components/ui/button"
import type { BlockVersion } from "@/lib/blocks"
import { getBlockRegistryData } from "@/lib/registry-server"
import { templateCategories } from "@/lib/templates"

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return templateCategories.map((category) => ({ category: category.id }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = templateCategories.find((item) => item.id === category)
  if (!categoryData) return {}
  return {
    title: categoryData.title,
    description: categoryData.description,
  }
}

export default async function TemplateCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = templateCategories.find((item) => item.id === category)

  if (!categoryData) {
    notFound()
  }

  const freeVersions = categoryData.versions.filter((v) => v.registryPath)

  const registryDataMap = Object.fromEntries(
    await Promise.all(
      freeVersions.map(async (version) => [
        version.id,
        await getBlockRegistryData(version.id),
      ])
    )
  )

  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl tracking-tighter md:text-4xl">
            {categoryData.title}
          </h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/templates">
              <ChevronLeftIcon data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>

        {freeVersions.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No templates available yet.
          </p>
        ) : (
          <div className="mt-8 space-y-16">
            {freeVersions.map((version) => {
              const blockVersion: BlockVersion = {
                id: version.id,
                title: version.title,
                registryPath: version.registryPath,
              }
              return (
                <section
                  key={version.id}
                  id={version.id}
                  className="scroll-mt-24"
                >
                  <BlockPreviewToolbar
                    version={blockVersion}
                    registryData={registryDataMap[version.id] ?? null}
                  />
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
