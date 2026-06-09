import { GeistSans } from "geist/font/sans"

import { formatStat, HEADING, LABEL, STATS } from "../lib/config"

export default function StatsSectionV3() {
  return (
    <section className={`${GeistSans.className} py-16 md:py-24`}>
      <div className="mx-auto max-w-5xl px-4">
        <p className="mb-3 text-sm tracking-wide text-muted-foreground">
          {LABEL}
        </p>
        <h2 className="max-w-xl text-3xl tracking-tight sm:text-4xl">
          {HEADING}
        </h2>

        <div className="mt-12 border-t border-border">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col gap-4 border-b border-border py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12"
            >
              <span className="text-sm text-muted-foreground sm:text-base">
                {stat.description}
              </span>
              <span className="text-5xl tracking-tight text-foreground lg:text-6xl">
                {formatStat(stat)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
