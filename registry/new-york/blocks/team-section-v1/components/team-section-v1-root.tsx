"use client"

import Image from "next/image"

import { useTeamCarousel } from "../hooks/use-team-carousel"
import { sectionHeader, type TeamMember } from "../lib/config"

type TeamSectionV1RootProps = {
  members: TeamMember[]
}

export function TeamSectionV1Root({ members }: TeamSectionV1RootProps) {
  const { stageRef, activeIndex, goTo, onCardClick } = useTeamCarousel(
    members.length
  )

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Team"
      className="relative overflow-hidden py-16 lg:py-24"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault()
          goTo(activeIndex + 1)
        } else if (event.key === "ArrowLeft") {
          event.preventDefault()
          goTo(activeIndex - 1)
        }
      }}
    >
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="text-4xl leading-[1.1] font-medium tracking-[-0.03em] text-foreground lg:text-5xl">
          {sectionHeader.title}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-muted-foreground">
          {sectionHeader.description}
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative mt-6 h-[calc(var(--tsv1-card,240px)+7rem)] cursor-grab touch-none overflow-hidden select-none data-[dragging=true]:cursor-grabbing"
      >
        {members.map((member, index) => (
          <article
            key={member.id}
            data-tsv1-card
            data-index={index}
            className="invisible absolute top-8 left-1/2 will-change-transform"
          >
            <div className="relative aspect-square overflow-hidden rounded-[15%] bg-muted shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)]">
              <Image
                src={member.avatarSrc}
                alt={member.name}
                fill
                unoptimized
                draggable={false}
                priority={index === 0}
                sizes="240px"
                className="scale-[1.12] object-cover"
              />
              <button
                type="button"
                data-tsv1-hit
                aria-label={`Show ${member.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                tabIndex={activeIndex === index ? -1 : 0}
                className="absolute inset-0"
                onClick={() => onCardClick(index)}
              />
            </div>
            <div
              data-tsv1-caption
              aria-hidden="true"
              className="mt-4 text-center opacity-0"
            >
              <h3 className="text-base leading-snug font-medium tracking-[-0.01em] text-foreground">
                {member.name}
              </h3>
              <p className="text-sm leading-snug text-muted-foreground">
                {member.title}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
