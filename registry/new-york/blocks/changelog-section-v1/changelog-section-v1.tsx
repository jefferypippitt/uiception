import Link from "next/link"
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react"
import { GeistMono } from "geist/font/mono"
import { Button } from "@/components/ui/button"

const entries = [
  {
    date: "MAR 1, 2026",
    title: "Composable Tool SDK",
    excerpt:
      "Our new tool primitives let you build and deploy AI coding agents faster. Mix, chain, and extend them to fit however your team works.",
    href: "#",
  },
  {
    date: "MAR 18, 2026",
    title: "Deep Codebase Context",
    excerpt:
      "Your agents can now reason across multiple repositories, branches, and file trees all within a single session.",
    href: "#",
  },
  {
    date: "APR 2, 2026",
    title: "Intelligent Model Routing",
    excerpt:
      "Agents now pick the right model for each task on their own, so you get the best balance of speed, cost, and quality without lifting a finger.",
    href: "#",
  },
]

export default function ChangelogSectionV1() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-4xl font-medium tracking-tighter sm:text-5xl">
          Latest Updates
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-0 md:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group py-8 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <div className="mb-3 flex items-center justify-between border-t pt-4">
                <p
                  className={`${GeistMono.className} text-xs font-semibold tracking-widest text-muted-foreground`}
                >
                  {entry.date}
                </p>
                <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 leading-snug font-semibold">{entry.title}</h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {entry.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="link" asChild className="px-0">
            <Link href="#">
              See all releases
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
