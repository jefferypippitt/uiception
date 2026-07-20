import { notFound } from "next/navigation"

import { BlockPreviewByVersionId } from "@/components/block-preview-by-version"
import {
  generateTemplateStaticParams,
  isKnownTemplateVersion,
  TemplatePreviewByVersionId,
} from "@/components/template-preview-by-version"
import {
  isKnownBlockVersion,
  registryBlockNames,
} from "@/lib/registry-data"

type PageProps = {
  params: Promise<{ versionId: string; slug?: string[] }>
}

export async function generateStaticParams() {
  const blockParams = registryBlockNames.map((versionId) => ({
    versionId,
    slug: [] as string[],
  }))

  const templateParams = await generateTemplateStaticParams()

  return [...blockParams, ...templateParams]
}

export default async function PreviewViewPage({ params }: PageProps) {
  const { versionId, slug } = await params
  const segments = slug ?? []

  if (isKnownTemplateVersion(versionId)) {
    return (
      <TemplatePreviewByVersionId versionId={versionId} slug={segments} />
    )
  }

  if (segments.length > 0 || !isKnownBlockVersion(versionId)) {
    notFound()
  }

  return (
    <div className="w-full min-w-0">
      <BlockPreviewByVersionId versionId={versionId} />
    </div>
  )
}
