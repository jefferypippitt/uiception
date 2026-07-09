import FeatureGrid from "./feature-grid"

export default function FeatureSectionV7() {
  return (
    <section className="w-full bg-background py-4 text-foreground md:py-6">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <h2 className="max-w-[22ch] text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-foreground lg:text-5xl">
          From a rough idea to something people trust
        </h2>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Most AI products stall somewhere between a clever demo and a real
          launch. Here is how teams close that gap, one step at a time.
        </p>
        <FeatureGrid />
      </div>
    </section>
  )
}
