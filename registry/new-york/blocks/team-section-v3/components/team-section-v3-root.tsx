"use client"

import Image from "next/image"

import { useTeamOrbit } from "../hooks/use-team-orbit"
import { sectionHeader, type TeamMember } from "../lib/config"

type TeamSectionV3RootProps = {
  members: TeamMember[]
}

export function TeamSectionV3Root({ members }: TeamSectionV3RootProps) {
  const { stageRef, textRef } = useTeamOrbit(members.length)

  return (
    <section aria-label="Team" className="relative overflow-hidden py-16">
      <div ref={stageRef} className="relative mx-auto h-[640px] max-w-5xl">
        <div
          ref={textRef}
          className="absolute top-[var(--tsv3-cy,50%)] left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <h2 className="text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-balance text-foreground sm:text-4xl lg:text-5xl">
            {sectionHeader.title}
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-balance text-muted-foreground">
            {sectionHeader.description}
          </p>
        </div>

        <ul>
          {members.map((member, index) => (
            <li
              key={member.id}
              data-tsv3-card
              className="invisible absolute top-0 left-1/2 w-[140px] will-change-transform"
            >
              <div className="relative aspect-square overflow-hidden rounded-full bg-muted shadow-[0_14px_30px_-14px_rgba(0,0,0,0.35)]">
                <Image
                  src={member.avatarSrc}
                  alt={`${member.name}, ${member.title}`}
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="156px"
                  className="scale-[1.12] object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
