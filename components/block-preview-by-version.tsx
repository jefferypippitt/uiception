import HeroSectionV1 from "@/registry/new-york/blocks/hero-section-v1/hero-section-v1"
import BrandsSectionV1 from "@/registry/new-york/blocks/brands-section-v1/brands-section-v1"
import BrandsSectionV2 from "@/registry/new-york/blocks/brands-section-v2/brands-section-v2"
import MacOsTerminalPage from "@/registry/new-york/blocks/mac-os-terminal/page"
import CursorTerminalPage from "@/registry/new-york/blocks/cursor-terminal/page"
import EventStreamPage from "@/registry/new-york/blocks/event-stream/page"
import HeroSectionV2 from "@/registry/new-york/blocks/hero-section-v2/hero-section-v2"
import HeroSectionV3 from "@/registry/new-york/blocks/hero-section-v3/hero-section-v3"
import CtaSectionV1 from "@/registry/new-york/blocks/cta-section-v1/cta-section-v1"
import CtaSectionV2 from "@/registry/new-york/blocks/cta-section-v2/cta-section-v2"
import CtaSectionV3 from "@/registry/new-york/blocks/cta-section-v3/cta-section-v3"
import FooterSectionV1 from "@/registry/new-york/blocks/footer-section-v1/footer-section-v1"
import FooterSectionV2 from "@/registry/new-york/blocks/footer-section-v2/footer-section-v2"
import FooterSectionV3 from "@/registry/new-york/blocks/footer-section-v3/footer-section-v3"
import ChatBotPage from "@/registry/new-york/blocks/chat-bot/page"
import SimpleChatbotPage from "@/registry/new-york/blocks/simple-chatbot/page"
import StatsSectionV1 from "@/registry/new-york/blocks/stats-section-v1/stats-section-v1"
import StatsSectionV2 from "@/registry/new-york/blocks/stats-section-v2/stats-section-v2"
import HeroSectionV4 from "@/registry/new-york/blocks/hero-section-v4/hero-section-v4"
import HowItWorksSectionV1 from "@/registry/new-york/blocks/how-it-works-section-v1/how-it-works-section-v1"
import HowItWorksSectionV2 from "@/registry/new-york/blocks/how-it-works-section-v2/how-it-works-section-v2"
import CodeBlockPage from "@/registry/new-york/blocks/code-block/page"
import Spreadsheet from "@/registry/new-york/blocks/spreadsheet/spreadsheet"
import GoogleChrome from "@/registry/new-york/blocks/google-chrome/google-chrome"
import GoogleChromeWindows from "@/registry/new-york/blocks/google-chrome-windows/google-chrome-windows"
import GoogleChromeWindowsWithVideo from "@/registry/new-york/blocks/google-chrome-windows-with-video/google-chrome-windows-with-video"
import MacbookPro from "@/registry/new-york/blocks/macbook-pro/macbook-pro"
import MacbookProWithImage from "@/registry/new-york/blocks/macbook-pro-with-image/macbook-pro-with-image"
import MacbookProWithVideo from "@/registry/new-york/blocks/macbook-pro-with-video/macbook-pro-with-video"
import BrandsSectionV3 from "@/registry/new-york/blocks/brands-section-v3/brands-section-v3"
import BrandsSectionV4 from "@/registry/new-york/blocks/brands-section-v4/brands-section-v4"
import FeatureSectionV1 from "@/registry/new-york/blocks/feature-section-v1/feature-section-v1"
import FeatureSectionV2 from "@/registry/new-york/blocks/feature-section-v2/feature-section-v2"
import HeroSectionV5 from "@/registry/new-york/blocks/hero-section-v5/hero-section-v5"
import FeatureSectionV3 from "@/registry/new-york/blocks/feature-section-v3/feature-section-v3"
import FeatureSectionV4 from "@/registry/new-york/blocks/feature-section-v4/feature-section-v4"
import FeatureSectionV5 from "@/registry/new-york/blocks/feature-section-v5/feature-section-v5"
import FeatureSectionV6 from "@/registry/new-york/blocks/feature-section-v6/feature-section-v6"
import FeatureSectionV7 from "@/registry/new-york/blocks/feature-section-v7/feature-section-v7"
import FeatureSectionV8 from "@/registry/new-york/blocks/feature-section-v8/feature-section-v8"
import ChangelogSectionV1 from "@/registry/new-york/blocks/changelog-section-v1/changelog-section-v1"
import FaqSectionV1 from "@/registry/new-york/blocks/faq-section-v1/faq-section-v1"
import TestimonialsSectionV1 from "@/registry/new-york/blocks/testimonials-section-v1/testimonials-section-v1"
import TestimonialsSectionV2 from "@/registry/new-york/blocks/testimonials-section-v2/testimonials-section-v2"
import BrandsSectionV5 from "@/registry/new-york/blocks/brands-section-v5/brands-section-v5"
import BrandsSectionV6 from "@/registry/new-york/blocks/brands-section-v6/brands-section-v6"
import HeroSectionV6 from "@/registry/new-york/blocks/hero-section-v6/hero-section-v6"
import HeroSectionV7 from "@/registry/new-york/blocks/hero-section-v7/hero-section-v7"
import HeroSectionV8 from "@/registry/new-york/blocks/hero-section-v8/hero-section-v8"
import HeroSectionV9 from "@/registry/new-york/blocks/hero-section-v9/hero-section-v9"
import PricingSectionV1 from "@/registry/new-york/blocks/pricing-section-v1/pricing-section-v1"
import GallerySectionV1 from "@/registry/new-york/blocks/gallery-section-v1/gallery-section-v1"
import NavbarSectionV1Page from "@/registry/new-york/blocks/navbar-section-v1/page"
import NavbarSectionV2Page from "@/registry/new-york/blocks/navbar-section-v2/page"
import NavbarSectionV3Page from "@/registry/new-york/blocks/navbar-section-v3/page"
import NavbarSectionV4Page from "@/registry/new-york/blocks/navbar-section-v4/page"
import NavbarSectionV5Page from "@/registry/new-york/blocks/navbar-section-v5/page"
import NavbarSectionV6Page from "@/registry/new-york/blocks/navbar-section-v6/page"
import NavbarSectionV7Page from "@/registry/new-york/blocks/navbar-section-v7/page"

const blockComponents: Record<string, React.ComponentType> = {
  "brands-section-v1": BrandsSectionV1,
  "brands-section-v2": BrandsSectionV2,
  "hero-section-v1": HeroSectionV1,
  "mac-os-terminal": MacOsTerminalPage,
  "cursor-terminal": CursorTerminalPage,
  "event-stream": EventStreamPage,
  "hero-section-v2": HeroSectionV2,
  "hero-section-v3": HeroSectionV3,
  "cta-section-v1": CtaSectionV1,
  "cta-section-v2": CtaSectionV2,
  "cta-section-v3": CtaSectionV3,
  "footer-section-v1": FooterSectionV1,
  "footer-section-v2": FooterSectionV2,
  "footer-section-v3": FooterSectionV3,
  "chat-bot": ChatBotPage,
  "simple-chatbot": SimpleChatbotPage,
  "stats-section-v1": StatsSectionV1,
  "stats-section-v2": StatsSectionV2,
  "hero-section-v4": HeroSectionV4,
  "how-it-works-section-v1": HowItWorksSectionV1,
  "how-it-works-section-v2": HowItWorksSectionV2,
  "code-block": CodeBlockPage,
  spreadsheet: Spreadsheet,
  "google-chrome": GoogleChrome,
  "google-chrome-windows": GoogleChromeWindows,
  "google-chrome-windows-with-video": GoogleChromeWindowsWithVideo,
  "macbook-pro": MacbookPro,
  "macbook-pro-with-image": MacbookProWithImage,
  "macbook-pro-with-video": MacbookProWithVideo,
  "brands-section-v3": BrandsSectionV3,
  "brands-section-v4": BrandsSectionV4,
  "brands-section-v5": BrandsSectionV5,
  "brands-section-v6": BrandsSectionV6,
  "feature-section-v1": FeatureSectionV1,
  "feature-section-v2": FeatureSectionV2,
  "hero-section-v5": HeroSectionV5,
  "hero-section-v6": HeroSectionV6,
  "hero-section-v7": HeroSectionV7,
  "hero-section-v8": HeroSectionV8,
  "hero-section-v9": HeroSectionV9,
  "feature-section-v3": FeatureSectionV3,
  "feature-section-v4": FeatureSectionV4,
  "feature-section-v5": FeatureSectionV5,
  "feature-section-v6": FeatureSectionV6,
  "feature-section-v7": FeatureSectionV7,
  "feature-section-v8": FeatureSectionV8,
  "changelog-section-v1": ChangelogSectionV1,
  "faq-section-v1": FaqSectionV1,
  "testimonials-section-v1": TestimonialsSectionV1,
  "testimonials-section-v2": TestimonialsSectionV2,
  "pricing-section-v1": PricingSectionV1,
  "gallery-section-v1": GallerySectionV1,
  "navbar-section-v1": NavbarSectionV1Page,
  "navbar-section-v2": NavbarSectionV2Page,
  "navbar-section-v3": NavbarSectionV3Page,
  "navbar-section-v4": NavbarSectionV4Page,
  "navbar-section-v5": NavbarSectionV5Page,
  "navbar-section-v6": NavbarSectionV6Page,
  "navbar-section-v7": NavbarSectionV7Page,
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
