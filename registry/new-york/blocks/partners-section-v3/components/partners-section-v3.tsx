"use client"

import { useRef } from "react"

import PartnerItem from "./partner-item"
import { usePartnersV3Motion } from "../hooks/use-partners-v3-motion"
import { partnersSectionV3Content } from "../lib/config"
import { partners } from "../lib/partners"

export default function PartnersSectionV3() {
  const { heading, description } = partnersSectionV3Content
  const sectionRef = useRef<HTMLElement>(null)

  usePartnersV3Motion(sectionRef)

  const words = heading.split(" ")

  return (
    <section ref={sectionRef} className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2
            data-pv3-heading
            className="text-3xl leading-[1.05] font-medium tracking-[-0.035em] text-balance text-foreground sm:text-4xl lg:text-5xl"
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <span data-pv3-word>{word}</span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p
            data-pv3-description
            className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
          >
            {description}
          </p>
        </div>

        <ul
          data-pv3-list
          aria-label="Partner companies"
          className="mx-auto mt-14 grid w-fit grid-cols-1 gap-x-20 md:mt-20 md:grid-cols-2 lg:gap-x-32"
        >
          {partners.map((partner) => (
            <PartnerItem key={partner.name} partner={partner} />
          ))}
        </ul>
      </div>
    </section>
  )
}
