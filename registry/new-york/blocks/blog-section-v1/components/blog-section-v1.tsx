import Image from "next/image"
import Link from "next/link"
import { GeistSans } from "geist/font/sans"
import { FlameIcon, RadioTowerIcon } from "lucide-react"

import { createBlockImage } from "@/lib/block-media"

import { sectionMeta, spotlight, trending } from "../lib/config"

const blockImage = createBlockImage("blog-section-v1")

const featured = {
  src: blockImage(spotlight.imageFile),
  alt: spotlight.alt,
  title: spotlight.title,
  href: spotlight.href,
  author: {
    name: spotlight.author.name,
    avatarSrc: blockImage(spotlight.author.avatarFile),
  },
}

const trendingPosts = trending.map((post) => ({
  src: blockImage(post.imageFile),
  alt: post.alt,
  title: post.title,
  href: post.href,
}))

export default function BlogSectionV1() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className={`m-0 font-sans text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-balance sm:text-[2.625rem] lg:text-5xl lg:leading-[1.06] ${GeistSans.className}`}
        >
          {sectionMeta.title}
        </h2>

        <div className="mt-6 border-t border-border" />

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-0">
          <div className="flex flex-col lg:border-r lg:border-border lg:pr-10">
            <p className="mb-4 flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
              <RadioTowerIcon className="size-4.5 shrink-0" aria-hidden />
              {sectionMeta.spotlightLabel}
            </p>

            <Link
              href={featured.href}
              className="group flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="relative aspect-2/1 w-full overflow-hidden rounded-xl bg-muted sm:aspect-video">
                <Image
                  src={featured.src}
                  alt={featured.alt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                {featured.title}
              </h3>
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <Image
                src={featured.author.avatarSrc}
                alt=""
                width={36}
                height={36}
                unoptimized
                className="size-9 rounded-full object-cover"
              />
              <span className="text-base text-muted-foreground">
                {featured.author.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:pl-10">
            <p className="mb-4 flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
              <FlameIcon className="size-4.5 shrink-0" aria-hidden />
              {sectionMeta.trendingLabel}
            </p>

            <ul className="flex flex-1 flex-col justify-between divide-y divide-border">
              {trendingPosts.map((post) => (
                <li key={post.title + post.src} className="flex flex-1 items-center py-4 first:pt-0 last:pb-0">
                  <Link
                    href={post.href}
                    className="group flex w-full items-start gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
                      <Image
                        src={post.src}
                        alt={post.alt}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="80px"
                      />
                    </div>
                    <h3 className="min-w-0 flex-1 pt-0.5 text-base font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-lg">
                      {post.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
