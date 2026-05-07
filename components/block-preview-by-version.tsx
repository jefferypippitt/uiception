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
import FooterSectionV2 from "@/registry/new-york/blocks/footer-section-v2/footer-section-v2"
import ChatBot from "@/registry/new-york/blocks/chat-bot/chat-bot"
import SimpleChatbot from "@/registry/new-york/blocks/simple-chatbot/simple-chatbot"
import StatsSectionV1 from "@/registry/new-york/blocks/stats-section-v1/stats-section-v1"
import StatsSectionV2 from "@/registry/new-york/blocks/stats-section-v2/stats-section-v2"
import HeroSectionV4 from "@/registry/new-york/blocks/hero-section-v4/hero-section-v4"
import HowItWorksSectionV1 from "@/registry/new-york/blocks/how-it-works-section-v1/how-it-works-section-v1"
import HowItWorksSectionV2 from "@/registry/new-york/blocks/how-it-works-section-v2/how-it-works-section-v2"
import CodeBlock from "@/registry/new-york/blocks/code-block/code-block"
import BrandsSectionV3 from "@/registry/new-york/blocks/brands-section-v3/brands-section-v3"
import BrandsSectionV4 from "@/registry/new-york/blocks/brands-section-v4/brands-section-v4"
import FeatureSectionV1 from "@/registry/new-york/blocks/feature-section-v1/feature-section-v1"
import FeatureSectionV2 from "@/registry/new-york/blocks/feature-section-v2/feature-section-v2"
import HeroSectionV5 from "@/registry/new-york/blocks/hero-section-v5/hero-section-v5"
import FeatureSectionV3 from "@/registry/new-york/blocks/feature-section-v3/feature-section-v3"
import FeatureSectionV4 from "@/registry/new-york/blocks/feature-section-v4/feature-section-v4"
import ChangelogSectionV1 from "@/registry/new-york/blocks/changelog-section-v1/changelog-section-v1"
import BrandsSectionV5 from "@/registry/new-york/blocks/brands-section-v5/brands-section-v5"
import HeroSectionV6 from "@/registry/new-york/blocks/hero-section-v6/hero-section-v6"
import PricingSectionV1 from "@/registry/new-york/blocks/pricing-section-v1/pricing-section-v1"
import LoremDemo from "@/components/blocks/navbar-lorem-demo"
import NavbarSectionV1 from "@/registry/new-york/blocks/navbar-section-v1/navbar-section-v1"
import NavbarSectionV2 from "@/registry/new-york/blocks/navbar-section-v2/navbar-section-v2"
import NavbarSectionV3 from "@/registry/new-york/blocks/navbar-section-v3/navbar-section-v3"

function NavbarSectionV1WithLoremDemo() {
  return (
    <>
      <NavbarSectionV1 />
      <LoremDemo />
    </>
  )
}

function NavbarSectionV2WithLoremDemo() {
  return (
    <>
      <NavbarSectionV2 />
      <LoremDemo />
    </>
  )
}

function NavbarSectionV3WithLoremDemo() {
  return (
    <>
      <NavbarSectionV3 />
      <LoremDemo />
    </>
  )
}

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
  "footer-section-v2": FooterSectionV2,
  "chat-bot": ChatBot,
  "simple-chatbot": SimpleChatbot,
  "stats-section-v1": StatsSectionV1,
  "stats-section-v2": StatsSectionV2,
  "hero-section-v4": HeroSectionV4,
  "how-it-works-section-v1": HowItWorksSectionV1,
  "how-it-works-section-v2": HowItWorksSectionV2,
  "code-block": CodeBlock,
  "brands-section-v3": BrandsSectionV3,
  "brands-section-v4": BrandsSectionV4,
  "brands-section-v5": BrandsSectionV5,
  "feature-section-v1": FeatureSectionV1,
  "feature-section-v2": FeatureSectionV2,
  "hero-section-v5": HeroSectionV5,
  "hero-section-v6": HeroSectionV6,
  "feature-section-v3": FeatureSectionV3,
  "feature-section-v4": FeatureSectionV4,
  "changelog-section-v1": ChangelogSectionV1,
  "pricing-section-v1": PricingSectionV1,
  "navbar-section-v1": NavbarSectionV1WithLoremDemo,
  "navbar-section-v2": NavbarSectionV2WithLoremDemo,
  "navbar-section-v3": NavbarSectionV3WithLoremDemo,
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
