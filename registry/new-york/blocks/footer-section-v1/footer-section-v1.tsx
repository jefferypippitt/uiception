import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { InstagramIcon } from "@/components/ui/svgs/instagramIcon"
import { TiktokIconDark } from "@/components/ui/svgs/tiktokIconDark"
import { TiktokIconLight } from "@/components/ui/svgs/tiktokIconLight"

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Workflows", "Automation", "Analytics"],
  },
  {
    title: "Solutions",
    links: ["Startups", "Agencies", "Enterprise", "Developers"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "Blog", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Privacy", "Terms"],
  },
]

export default function FooterSectionV1() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Card className="rounded-sm">
          <CardHeader className="block px-6 pt-7 pb-0 md:px-8 md:pt-8">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
              <div className="space-y-2">
                <Link
                  href="#"
                  className="inline-flex w-fit items-center text-xl font-semibold tracking-tight"
                >
                  uiception
                </Link>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Powerful automation software for modern teams.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {footerColumns.map((column) => (
                  <div key={column.title} className="space-y-2.5">
                    <h3 className="text-xs text-muted-foreground">
                      {column.title}
                    </h3>
                    <ul className="space-y-1.5 text-sm">
                      {column.links.map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="transition-colors hover:text-foreground/70"
                          >
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {column.title === "Product" ? (
                      <Link
                        href="#"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                      >
                        View all
                        <ArrowRight className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8 md:pb-6">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <TiktokIconLight className="size-4 dark:hidden" />
                <TiktokIconDark className="hidden size-4 dark:block" />
                TikTok
              </Link>
            </div>
            <p>&copy; uiception 2026</p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
