import HeroSectionV1 from "@/registry/new-york/blocks/hero-section-v1/hero-section-v1"
import BrandsSectionV1 from "@/registry/new-york/blocks/brands-section-v1/brands-section-v1"
import BrandsSectionV2 from "@/registry/new-york/blocks/brands-section-v2/brands-section-v2"
import CursorTerminal from "@/registry/new-york/blocks/cursor-terminal/cursor-terminal"
import MacOsTerminal from "@/registry/new-york/blocks/mac-os-terminal/mac-os-terminal"
import EventStream from "@/registry/new-york/blocks/event-stream/event-stream"
import HeroSectionV2 from "@/registry/new-york/blocks/hero-section-v2/hero-section-v2"
import HeroSectionV3 from "@/registry/new-york/blocks/hero-section-v3/hero-section-v3"
import CtaSectionV1 from "@/registry/new-york/blocks/cta-section-v1/cta-section-v1"
import CtaSectionV2 from "@/registry/new-york/blocks/cta-section-v2/cta-section-v2"
import FooterSectionV1 from "@/registry/new-york/blocks/footer-section-v1/footer-section-v1"
import ChatBot from "@/registry/new-york/blocks/chat-bot/chat-bot"
import SimpleChatbot from "@/registry/new-york/blocks/simple-chatbot/simple-chatbot"
import FeatureSectionV1 from "@/registry/new-york/blocks/feature-section-v1/feature-section-v1"
import StatsSectionV1 from "@/registry/new-york/blocks/stats-section-v1/stats-section-v1"
import HeroSectionV4 from "@/registry/new-york/blocks/hero-section-v4/hero-section-v4"





const blockComponents: Record<string, React.ComponentType> = {
  "brands-section-v1": BrandsSectionV1,
  "brands-section-v2": BrandsSectionV2,
  "hero-section-v1": HeroSectionV1,
  "mac-os-terminal": MacOsTerminal,
  "cursor-terminal": CursorTerminal,
  "event-stream": EventStream,
  "hero-section-v2": HeroSectionV2,
  "hero-section-v3": HeroSectionV3,
  "cta-section-v1": CtaSectionV1,
  "cta-section-v2": CtaSectionV2,
  "footer-section-v1": FooterSectionV1,
  "chat-bot": ChatBot,
  "simple-chatbot": SimpleChatbot,
  "feature-section-v1": FeatureSectionV1,
  "stats-section-v1": StatsSectionV1,
  "hero-section-v4": HeroSectionV4,
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
