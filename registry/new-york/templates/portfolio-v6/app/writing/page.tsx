import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { ResumeRow } from "../../components/resume-row"
import { formatWritingDate, getWritingPosts } from "../../lib/writing"

export default function WritingIndexPage() {
  const posts = getWritingPosts()

  return (
    <div className="flex flex-col gap-8" data-resume-page="index">
      <ul className="flex flex-col gap-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <ResumeRow date={formatWritingDate(post.date)}>
              <Link
                href={`/writing/${post.slug}`}
                className="group flex flex-col gap-1"
              >
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:underline">
                  {post.title}
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                {post.description ? (
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </span>
                ) : null}
              </Link>
            </ResumeRow>
          </li>
        ))}
      </ul>
    </div>
  )
}
