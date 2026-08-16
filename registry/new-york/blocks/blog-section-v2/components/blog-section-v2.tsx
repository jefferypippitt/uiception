import Image from "next/image"
import Link from "next/link"

import { createBlockImage } from "@/lib/block-media"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"

import { author, sections } from "../lib/config"

const blockImage = createBlockImage("blog-section-v2")

const authorData = {
  label: author.label,
  name: author.name,
  title: author.title,
  avatarSrc: blockImage(author.avatarFile),
  initials: author.initials,
  githubHref: author.githubHref,
  githubLabel: author.githubLabel,
}

const contentSections = sections.map((section) => ({
  title: section.title,
  description: section.description,
  body: section.body,
  alt: section.alt,
  src: blockImage(section.imageFile),
}))

export default function BlogSectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-0">
          <aside className="flex flex-col gap-4 border-b border-border pb-10 lg:sticky lg:top-8 lg:self-start lg:border-b-0 lg:pb-0 lg:pr-10">
            <Avatar className="size-24 rounded-none after:rounded-none">
              <AvatarImage
                src={authorData.avatarSrc}
                alt={authorData.name}
                className="rounded-none"
              />
              <AvatarFallback className="rounded-none">
                {authorData.initials}
              </AvatarFallback>
            </Avatar>

            <p className="text-sm tracking-tight text-muted-foreground">
              {authorData.label}
            </p>

            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {authorData.name}
              </p>
              <p className="text-sm text-muted-foreground">{authorData.title}</p>
            </div>

            <Link
              href={authorData.githubHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <GithubLight className="size-4 shrink-0 dark:hidden" aria-hidden />
              <GithubDark
                className="hidden size-4 shrink-0 dark:block"
                aria-hidden
              />
              {authorData.githubLabel}
            </Link>
          </aside>

          <div className="flex flex-col gap-14 lg:border-l lg:border-border lg:pl-10">
            {contentSections.map((section) => (
              <article key={section.title} className="flex flex-col gap-4">
                <h2 className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-balance lg:text-4xl">
                  {section.title}
                </h2>
                <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-none bg-muted">
                  <Image
                    src={section.src}
                    alt={section.alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 48rem"
                  />
                </div>
                <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-foreground">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
