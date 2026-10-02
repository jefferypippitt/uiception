import { sectionHeader } from "../lib/config"
import LatencyPanel from "./latency-panel"

export default function StatsSectionV5() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-12">
          <h2 className="max-w-md text-3xl leading-[1.15] font-medium tracking-tight text-foreground md:text-4xl">
            {sectionHeader.title}
          </h2>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground md:justify-self-end">
            {sectionHeader.subtitle}
          </p>
        </div>

        <LatencyPanel />
      </div>
    </section>
  )
}
