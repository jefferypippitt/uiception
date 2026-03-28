import HeroSectionV1 from "@/registry/new-york/blocks/hero-section-v1/hero-section-v1"
import BrandsSectionV1 from "@/registry/new-york/blocks/brands-section-v1/brands-section-v1"
import CursorTerminal from "@/registry/new-york/blocks/cursor-terminal/cursor-terminal"
import MacOsTerminal from "@/registry/new-york/blocks/mac-os-terminal/mac-os-terminal"

const blockComponents: Record<string, React.ComponentType> = {
  "brands-section-v1": BrandsSectionV1,
  "hero-section-v1": HeroSectionV1,
  "mac-os-terminal": MacOsTerminal,
  "cursor-terminal": CursorTerminal,
}

export function BlockPreviewByVersionId({ versionId }: { versionId: string }) {
  const Component = blockComponents[versionId]

  if (!Component) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Preview not available for &quot;{versionId}&quot;.
      </div>
    )
  }

  return <Component />
}
