import Link from "next/link"
import { notFound } from "next/navigation"

import { Avatar } from "../../../components/avatar"
import { ThemeToggle } from "../../../components/theme-toggle"
import { formatNoteDate, getNote, getNotes } from "../../../lib/notes"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }))
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params
  const note = getNote(slug)

  if (!note) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
        <Link href="/" className="flex items-center gap-4">
          <Avatar />
          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Jon Doe
            </p>
            <p className="text-sm text-muted-foreground">
              Fullstack Developer
            </p>
          </div>
        </Link>

        <article className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {note.title}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tabular-nums tracking-wide text-muted-foreground">
            {formatNoteDate(note.date)}
          </p>
          <div className="mt-8 flex flex-col gap-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            <note.body />
          </div>
        </article>
      </div>

      <div className="mt-auto flex justify-end pt-12 md:pt-16">
        <ThemeToggle />
      </div>
    </div>
  )
}
