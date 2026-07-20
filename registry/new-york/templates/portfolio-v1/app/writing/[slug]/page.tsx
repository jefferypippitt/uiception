import { notFound } from "next/navigation"

import {
  formatContentDate,
  getWriting,
  getWritingEntry,
} from "../../../lib/posts"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getWriting()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function WritingEntryPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getWritingEntry(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1>{post.title}</h1>
      <p>{formatContentDate(post.date)}</p>
      <post.body />
    </div>
  )
}
