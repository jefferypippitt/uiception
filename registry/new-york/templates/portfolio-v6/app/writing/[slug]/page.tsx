import Link from "next/link"
import { notFound } from "next/navigation"

import {
  formatWritingDate,
  getAdjacentWritingPosts,
  getWritingPost,
  getWritingPosts,
} from "../../../lib/writing"

export function generateStaticParams() {
  return getWritingPosts().map((post) => ({ slug: post.slug }))
}

export default async function WritingEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getWritingPost(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentWritingPosts(slug)

  return (
    <article className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <Link
          href="/writing"
          data-resume-back
          className="inline-flex w-fit text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h2
              className="text-sm font-semibold tracking-tight text-foreground"
              data-resume-heading
            >
              {post.title}
            </h2>
            {post.description ? (
              <p
                className="mt-2 text-sm text-muted-foreground"
                data-resume-dek
                data-resume-reveal
              >
                {post.description}
              </p>
            ) : null}
          </div>
          <time
            dateTime={post.date}
            data-resume-when
            data-resume-reveal
            className="shrink-0 text-sm tabular-nums text-muted-foreground"
          >
            {formatWritingDate(post.date)}
          </time>
        </div>
      </div>

      <div
        className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground"
        data-resume-prose
      >
        {post.body()}
      </div>

      {prev || next ? (
        <nav
          aria-label="Post navigation"
          className="flex items-center justify-between border-t border-border/60 pt-8 text-sm"
        >
          <div>
            {prev ? (
              <Link
                href={`/writing/${prev.slug}`}
                data-resume-prev
                data-resume-reveal
                className="inline-flex text-muted-foreground hover:text-foreground"
              >
                ← Previous
              </Link>
            ) : null}
          </div>
          <div>
            {next ? (
              <Link
                href={`/writing/${next.slug}`}
                data-resume-next
                data-resume-reveal
                className="inline-flex text-muted-foreground hover:text-foreground"
              >
                Next →
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </article>
  )
}
