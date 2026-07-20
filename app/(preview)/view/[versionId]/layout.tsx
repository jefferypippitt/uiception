import type { ReactNode } from "react"

import {
  isKnownTemplateVersion,
  TemplatePreviewFrame,
} from "@/components/template-preview-by-version"

type LayoutProps = {
  children: ReactNode
  params: Promise<{ versionId: string }>
}

export default async function PreviewVersionLayout({
  children,
  params,
}: LayoutProps) {
  const { versionId } = await params

  if (!isKnownTemplateVersion(versionId)) {
    return children
  }

  return (
    <TemplatePreviewFrame versionId={versionId}>{children}</TemplatePreviewFrame>
  )
}
