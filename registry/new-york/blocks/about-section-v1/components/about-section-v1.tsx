import { FEATURES, HEADING, PARAGRAPHS, STATS } from "../lib/config"

export default function AboutSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-balance text-foreground lg:text-4xl">
            {HEADING}
          </h2>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {PARAGRAPHS.map((paragraph, index) => (
                <p
                  key={index}
                  className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-[-0.01em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:mt-16">
          {STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1">
              <span className="text-4xl font-medium tracking-[-0.02em] text-foreground lg:text-5xl">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
