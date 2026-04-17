import type { Metadata } from "next"
import { Link } from "next-view-transitions"

import { blockCategories, type BlockCategoryId } from "@/lib/blocks"
import { BlockCategoryTitle } from "./block-category-title"

export const metadata: Metadata = {
  title: "Blocks",
  description: "Browse all UI block categories — hero sections, navbars, features, pricing, and more. Copy-paste ready for Next.js and shadcn.",
}

const sk = "animate-pulse rounded bg-foreground/10"

function NavbarPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center justify-between rounded border bg-foreground/5 px-2 py-1.5">
        <div className={`h-2 w-10 ${sk}`} />
        <div className="flex gap-1.5">
          <div className={`h-1.5 w-6 ${sk}`} />
          <div className={`h-1.5 w-6 ${sk}`} />
          <div className={`h-1.5 w-6 ${sk}`} />
        </div>
        <div className={`h-4 w-8 ${sk}`} />
      </div>
      <div className={`h-1.5 w-3/4 ${sk}`} />
      <div className={`h-1.5 w-1/2 ${sk}`} />
    </div>
  )
}

function HeroSectionPreview() {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-4">
      <div className={`h-3 w-14 rounded-full ${sk}`} />
      <div className={`h-2.5 w-4/5 ${sk}`} />
      <div className={`h-2.5 w-3/5 ${sk}`} />
      <div className={`h-1.5 w-2/3 ${sk}`} />
      <div className="flex gap-1.5 mt-0.5">
        <div className={`h-5 w-14 ${sk}`} />
        <div className={`h-5 w-14 opacity-50 ${sk}`} />
      </div>
    </div>
  )
}

function LogoCloudPreview() {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-4">
      <div className={`h-1.5 w-24 ${sk}`} />
      <div className="flex gap-2 flex-wrap justify-center">
        {[10, 14, 10, 12, 10].map((w, i) => (
          <div key={i} className={`h-3 w-${w} ${sk}`} style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  )
}

function HowItWorksPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`h-5 w-5 rounded-full ${sk}`} />
          <div className="flex flex-1 flex-col gap-1">
            <div className={`h-1.5 w-2/3 ${sk}`} />
            <div className={`h-1 w-full opacity-70 ${sk}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CaseStudyPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className={`h-16 w-full rounded ${sk}`} />
      <div className={`h-1.5 w-1/2 ${sk}`} />
      <div className={`h-1.5 w-4/5 ${sk}`} />
      <div className="grid grid-cols-3 gap-1.5 mt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`h-8 w-full rounded border bg-foreground/5 ${sk}`} />
        ))}
      </div>
    </div>
  )
}

function AboutUsPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className={`h-2 w-24 ${sk}`} />
      <div className={`h-1.5 w-full ${sk}`} />
      <div className={`h-1.5 w-4/5 ${sk}`} />
      <div className="flex items-center gap-2 mt-1">
        <div className={`h-10 w-10 rounded-full ${sk}`} />
        <div className="flex flex-1 flex-col gap-1">
          <div className={`h-1.5 w-1/2 ${sk}`} />
          <div className={`h-1 w-2/3 opacity-70 ${sk}`} />
        </div>
      </div>
    </div>
  )
}

function ResourcesPreview() {
  return (
    <div className="grid grid-cols-2 gap-1.5 p-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1 rounded border bg-foreground/5 p-2">
          <div className={`h-1.5 w-2/3 ${sk}`} />
          <div className={`h-1 w-full opacity-70 ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function ValuePropositionPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className={`h-2.5 w-3/4 ${sk}`} />
      <div className={`h-1.5 w-1/2 ${sk}`} />
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1 rounded border bg-foreground/5 p-2">
            <div className={`h-1.5 w-full ${sk}`} />
            <div className={`h-1 w-2/3 opacity-70 ${sk}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function IntegrationsPreview() {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center rounded border bg-foreground/5 p-2">
          <div className={`h-4 w-8 ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function FeaturesPreview() {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1 rounded border bg-foreground/5 p-1.5">
          <div className={`h-3 w-3 rounded-sm ${sk}`} />
          <div className={`h-1.5 w-full ${sk}`} />
          <div className={`h-1.5 w-2/3 ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function PricingPreview() {
  return (
    <div className="flex gap-1.5 p-3">
      {[false, true, false].map((featured, i) => (
        <div key={i} className={`flex flex-1 flex-col gap-1.5 rounded border bg-foreground/5 p-2 ${featured ? "border-foreground/20" : "opacity-60"}`}>
          <div className={`h-1.5 w-3/4 ${sk}`} />
          <div className={`h-3 w-1/2 ${sk}`} />
          <div className={`h-3.5 w-full ${sk}`} />
          <div className={`h-1 w-full ${sk}`} />
          <div className={`h-1 w-4/5 ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function TestimonialsPreview() {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1 rounded border bg-foreground/5 p-2">
          <div className={`h-1.5 w-full ${sk}`} />
          <div className={`h-1.5 w-4/5 ${sk}`} />
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`h-4 w-4 rounded-full ${sk}`} />
            <div className={`h-1.5 w-16 ${sk}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CtaPreview() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border bg-foreground/5 mx-3 my-3 px-3 py-4">
      <div className={`h-2.5 w-3/4 ${sk}`} />
      <div className={`h-1.5 w-1/2 ${sk}`} />
      <div className="flex gap-1.5 mt-0.5">
        <div className={`h-5 w-14 ${sk}`} />
        <div className={`h-5 w-14 opacity-50 ${sk}`} />
      </div>
    </div>
  )
}

function FaqPreview() {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between border-b pb-1.5">
          <div className={`h-1.5 w-3/5 ${sk}`} />
          <div className={`h-3 w-3 rounded-sm ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function StatsPreview() {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1 rounded border bg-foreground/5 p-2">
          <div className={`h-4 w-10 ${sk}`} />
          <div className={`h-1.5 w-full ${sk}`} />
        </div>
      ))}
    </div>
  )
}

function ChangelogPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className={`h-1 w-10 ${sk}`} />
      <div className={`h-2.5 w-28 ${sk}`} />
      <div className="h-px w-full bg-foreground/10 mt-1" />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className={`h-1 w-10 ${sk}`} />
            <div className={`h-1.5 w-full ${sk}`} />
            <div className={`h-1 w-full opacity-70 ${sk}`} />
            <div className={`h-1 w-4/5 opacity-70 ${sk}`} />
          </div>
        ))}
      </div>
      <div className={`h-1.5 w-20 mt-1 ${sk}`} />
    </div>
  )
}

function FooterPreview() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className={`h-1.5 w-full ${sk}`} />
            <div className={`h-1 w-3/4 ${sk}`} />
            <div className={`h-1 w-2/3 ${sk}`} />
            <div className={`h-1 w-3/4 ${sk}`} />
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-muted mt-1" />
      <div className="flex justify-between">
        <div className={`h-1.5 w-20 ${sk}`} />
        <div className="flex gap-1.5">
          <div className={`h-3 w-3 rounded-sm ${sk}`} />
          <div className={`h-3 w-3 rounded-sm ${sk}`} />
          <div className={`h-3 w-3 rounded-sm ${sk}`} />
        </div>
      </div>
    </div>
  )
}

function BlockPreview({ id }: { id: BlockCategoryId }) {
  switch (id) {
    case "navbar": return <NavbarPreview />
    case "hero-section": return <HeroSectionPreview />
    case "brands": return <LogoCloudPreview />
    case "how-it-works": return <HowItWorksPreview />
    case "case-study": return <CaseStudyPreview />
    case "about-us": return <AboutUsPreview />
    case "resources": return <ResourcesPreview />
    case "value-proposition": return <ValuePropositionPreview />
    case "features": return <FeaturesPreview />
    case "integrations": return <IntegrationsPreview />
    case "pricing": return <PricingPreview />
    case "testimonials": return <TestimonialsPreview />
    case "cta": return <CtaPreview />
    case "faq": return <FaqPreview />
    case "stats": return <StatsPreview />
    case "footer": return <FooterPreview />
    case "changelog": return <ChangelogPreview />
  }
}

export default function BlocksPage() {
  return (
    <div className="pb-14 md:pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-4xl text-center">
          Explore All Categories
        </h1>

        <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {blockCategories.map((category) => (
            <Link
              key={category.id}
              href={`/blocks/${category.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border transition-colors hover:bg-muted/40"
            >
              <div className="flex-1 border-b bg-foreground/2">
                <BlockPreview id={category.id} />
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <BlockCategoryTitle id={category.id} title={category.title} />
                <p className="text-xs text-muted-foreground">
                  {category.versions.length} {category.versions.length === 1 ? "block" : "blocks"}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
