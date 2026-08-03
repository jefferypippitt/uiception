import Link from "next/link"

import { Avatar } from "../../components/avatar"
import { ThemeToggle } from "../../components/theme-toggle"
import { formatNoteDate, getNotes } from "../../lib/notes"

export default function NotesIndexPage() {
  const notes = getNotes()

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

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Notes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Short writing on fullstack development, shipping, and systems.
          </p>
          <ul className="mt-8 flex flex-col">
            {notes.map((note) => (
              <li
                key={note.slug}
                className="border-b border-dotted border-border/60 py-4 first:pt-0 last:border-b-0"
              >
                <Link
                  href={`/notes/${note.slug}`}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[0.9375rem] font-medium text-foreground transition-opacity group-hover:opacity-70">
                    {note.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatNoteDate(note.date)}
                    {note.description ? ` — ${note.description}` : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex justify-end pt-12 md:pt-16">
        <ThemeToggle />
      </div>
    </div>
  )
}
