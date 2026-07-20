import { notFound } from "next/navigation"

import { formatContentDate, getBook, getBooks } from "../../../lib/posts"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map((book) => ({ slug: book.slug }))
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    notFound()
  }

  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1>{book.title}</h1>
      <p>{formatContentDate(book.date)}</p>
      <book.body />
    </div>
  )
}
