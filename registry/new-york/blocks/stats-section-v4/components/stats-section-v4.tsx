import { sectionHeader, stats } from "../lib/config"
import { ScaleChart } from "./scale-chart"

export default function StatsSectionV4() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pt-16 md:min-h-[36rem] md:justify-between md:pt-24 md:pb-36 lg:min-h-[40rem] lg:pb-40">
        <h2 className="max-w-lg text-3xl leading-[1.15] font-medium tracking-tight md:text-4xl">
          {sectionHeader.title}{" "}
          <span className="text-muted-foreground">
            {sectionHeader.subtitle}
          </span>
        </h2>

        <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-10 gap-y-8 md:mt-16">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative mt-10 h-56 sm:h-72 md:absolute md:inset-0 md:mt-0 md:h-auto"
      >
        <ScaleChart />
      </div>
    </section>
  )
}
