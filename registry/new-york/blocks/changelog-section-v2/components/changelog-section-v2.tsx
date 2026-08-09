import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { GeistMono } from "geist/font/mono"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const entries = [
  {
    title: "Composable Tool SDK",
    description:
      "Our new tool primitives let you build and deploy AI coding agents faster. Mix, chain, and extend them to fit however your team works.",
    date: "July 24, 2026",
    category: "Feature",
    href: "#",
  },
  {
    title: "Deep Codebase Context",
    description:
      "Your agents can now reason across multiple repositories, branches, and file trees all within a single session.",
    date: "August 6, 2026",
    category: "Improvement",
    href: "#",
  },
  {
    title: "Intelligent Model Routing",
    description:
      "Agents now pick the right model for each task on their own, so you get the best balance of speed, cost, and quality without lifting a finger.",
    date: "August 19, 2026",
    category: "Performance",
    href: "#",
  },
]

export default function ChangelogSectionV2() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-medium tracking-tighter sm:text-4xl">
          Release Notes
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {entries.map((entry) => (
            <Card
              key={entry.title}
              className="gap-0 border-border/80 py-0 shadow-none"
            >
              <CardHeader className="gap-3 px-6 pt-7">
                <CardTitle className="text-lg leading-snug font-semibold">
                  {entry.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {entry.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pt-6 pb-6">
                <dl className="text-sm">
                  <div className="flex items-center justify-between border-t border-border/80 py-3">
                    <dt
                      className={`${GeistMono.className} text-xs tracking-widest uppercase`}
                    >
                      Date
                    </dt>
                    <dd className="font-medium text-foreground">
                      {entry.date}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-y border-border/80 py-3">
                    <dt
                      className={`${GeistMono.className} text-xs tracking-widest uppercase`}
                    >
                      Category
                    </dt>
                    <dd className="font-medium text-foreground">
                      {entry.category}
                    </dd>
                  </div>
                </dl>
              </CardContent>

              <CardFooter className="border-t-0 bg-transparent px-6 pt-0 pb-7">
                <Button asChild variant="outline">
                  <Link href={entry.href}>
                    Read announcement
                    <ArrowUpRightIcon />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
