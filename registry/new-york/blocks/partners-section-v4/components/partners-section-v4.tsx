import PartnerTile from "./partner-tile"
import { partnersSectionV4Content } from "../lib/config"
import { partners } from "../lib/partners"

export default function PartnersSectionV4() {
  const { heading, description } = partnersSectionV4Content

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 className="text-3xl leading-[1.05] font-medium tracking-[-0.035em] text-balance text-foreground sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <ul
          aria-label="Partner companies"
          className="mx-auto mt-14 grid max-w-5xl grid-cols-8 gap-2 py-2 sm:gap-3 sm:py-4 md:mt-20 md:gap-4 lg:py-6"
        >
          {partners.map((partner) => (
            <PartnerTile key={partner.name} partner={partner} />
          ))}
        </ul>
      </div>
    </section>
  )
}
