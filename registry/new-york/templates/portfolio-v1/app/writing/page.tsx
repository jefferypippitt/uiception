import Link from "next/link"

import { formatContentDate, getWriting } from "../../lib/posts"

export default async function WritingIndexPage() {
  const posts = await getWriting()

  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1>Writing</h1>
      <p>
        Notes from my work.
      </p>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              {formatContentDate(post.date)}
              {". "}
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
