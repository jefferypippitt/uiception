import type { ReactNode } from "react"

export type TemplatePreviewDefinition = {
  Frame: (props: { versionId: string; children: ReactNode }) => ReactNode
  Page: (props: { slug: string[] }) => Promise<ReactNode> | ReactNode
  generateStaticParams: () => Promise<{ slug: string[] }[]>
}
