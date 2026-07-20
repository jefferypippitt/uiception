import type { ReactNode } from "react"

import { portfolioV1Preview } from "@/components/template-previews/portfolio-v1"
import type { TemplatePreviewDefinition } from "@/components/template-previews/types"
import { getFreeTemplateVersions } from "@/lib/templates"

export type { TemplatePreviewDefinition } from "@/components/template-previews/types"

/** Host-only preview map — add an entry when you ship a new template. */
export const templatePreviews: Record<string, TemplatePreviewDefinition> = {
  "portfolio-v1": portfolioV1Preview,
}

export function isKnownTemplateVersion(versionId: string): boolean {
  return versionId in templatePreviews
}

export function getTemplatePreviewIds(): string[] {
  return Object.keys(templatePreviews)
}

export async function generateTemplateStaticParams(): Promise<
  { versionId: string; slug: string[] }[]
> {
  const params: { versionId: string; slug: string[] }[] = []

  for (const versionId of getTemplatePreviewIds()) {
    const preview = templatePreviews[versionId]
    if (!preview) continue
    const paths = await preview.generateStaticParams()
    for (const { slug } of paths) {
      params.push({ versionId, slug })
    }
  }

  return params
}

export function TemplatePreviewFrame({
  versionId,
  children,
}: {
  versionId: string
  children: ReactNode
}) {
  const preview = templatePreviews[versionId]
  if (!preview) return children
  return <preview.Frame versionId={versionId}>{children}</preview.Frame>
}

export async function TemplatePreviewByVersionId({
  versionId,
  slug,
}: {
  versionId: string
  slug: string[]
}) {
  const preview = templatePreviews[versionId]

  if (!preview) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Preview not available for &quot;{versionId}&quot;.
      </div>
    )
  }

  return preview.Page({ slug })
}

/** Catalog templates that are missing a host preview entry. */
export function getTemplatesMissingPreview(): string[] {
  const registered = new Set(getTemplatePreviewIds())
  return getFreeTemplateVersions()
    .map((v) => v.id)
    .filter((id) => !registered.has(id))
}
