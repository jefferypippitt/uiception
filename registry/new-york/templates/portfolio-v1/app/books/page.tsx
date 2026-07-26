import Link from "next/link"

import { getBooks } from "../../lib/posts"

function bookYear(date: string) {
  return date.slice(0, 4)
}

export default async function BooksIndexPage() {
  const books = await getBooks()

  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1>Books</h1>
      <p>
        Longer popular-science books from my public work.
      </p>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        books.map((book) => (
          <div key={book.slug}>
            <h2 className="flex items-baseline justify-between gap-4">
              <Link href={`/books/${book.slug}`}>{book.title}</Link>
              <span className="shrink-0 text-base font-normal">
                {bookYear(book.date)}
              </span>
            </h2>
            {book.description ? <p>{book.description}</p> : null}
          </div>
        ))
      )}
    </div>
  )
}
