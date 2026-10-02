import PartnerLogo from "./partner-logo"
import { partnersSectionV1Content } from "../lib/config"
import { partners } from "../lib/partners"

export default function PartnersSectionV1() {
  const { heading, description } = partnersSectionV1Content

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
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-20 md:grid-cols-3 md:gap-y-14"
        >
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="flex items-center justify-center"
            >
              <PartnerLogo partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
