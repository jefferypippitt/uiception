import { notFound } from "next/navigation"

import { BlockPreviewByVersionId } from "@/components/block-preview-by-version"
import { isKnownBlockVersion, registryBlockNames } from "@/lib/registry-data"

type PageProps = {
  params: Promise<{ versionId: string }>
}

export function generateStaticParams() {
  return registryBlockNames.map((versionId) => ({ versionId }))
}

export default async function BlockViewPage({ params }: PageProps) {
  const { versionId } = await params

  if (!isKnownBlockVersion(versionId)) {
    notFound()
  }

  return (
    <div className="w-full min-w-0">
      <BlockPreviewByVersionId versionId={versionId} />
    </div>
  )
}
