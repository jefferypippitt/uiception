import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SaturnDecoration } from "../components/saturn-decoration"
import { formatContentDate, getWriting } from "../lib/posts"

export default async function HomePage() {
  const recentNotes = (await getWriting()).slice(0, 3)

  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1 className="flex items-center justify-between gap-4">
        <span>Jon Doe</span>
        <SaturnDecoration />
      </h1>

      <p>
        I&apos;m a physicist. I work on planetary science and the structure of
        the solar system, and I spend as much time explaining the universe as
        measuring it.
      </p>

      <p>
        Most of my public work is about why planets are the way they are, and
        what &ldquo;far&rdquo; actually measures. I write books and notes for
        people who have looked up and wanted a clearer picture of what we are
        seeing.
      </p>

      {recentNotes.length > 0 && (
        <>
          <p>What I&apos;ve been writing lately:</p>
          <ul>
            {recentNotes.map((note) => (
              <li key={note.slug}>
                {formatContentDate(note.date)}
                {". "}
                <Link href={`/writing/${note.slug}`}>{note.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p>Find your way around:</p>
      <ul>
        <li>
          <Link href="/writing" className="inline-flex items-center gap-1">
            Writing
            <ChevronRight className="size-[0.9em]" aria-hidden />
          </Link>
          <span className="text-muted-foreground">
            {" short notes and essays"}
          </span>
        </li>
        <li>
          <Link href="/books" className="inline-flex items-center gap-1">
            Books
            <ChevronRight className="size-[0.9em]" aria-hidden />
          </Link>
          <span className="text-muted-foreground">
            {" longer, book-length work"}
          </span>
        </li>
        <li>
          <Link href="/contact" className="inline-flex items-center gap-1">
            Contact Me
            <ChevronRight className="size-[0.9em]" aria-hidden />
          </Link>
          <span className="text-muted-foreground">{" say hello"}</span>
        </li>
      </ul>

      <p>
        Elsewhere, I&apos;m on{" "}
        <Link href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </Link>
        ,{" "}
        <Link href="https://twitter.com" target="_blank" rel="noreferrer">
          Twitter
        </Link>
        , and{" "}
        <Link href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </Link>
        .
      </p>
    </div>
  )
}
