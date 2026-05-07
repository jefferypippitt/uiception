import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Card, CardHeader } from "@/components/ui/card"

type FooterLink = {
  label: string
  href: string
  externalArrow?: boolean
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Agents", href: "#", externalArrow: true },
      { label: "Enterprise", href: "#", externalArrow: true },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Download", href: "#", externalArrow: true },
      { label: "Changelog", href: "#" },
      { label: "Docs", href: "#", externalArrow: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "#", externalArrow: true },
      { label: "Blog", href: "#", externalArrow: true },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#", externalArrow: true },
      { label: "Privacy Policy", href: "#", externalArrow: true },
      { label: "Data Use", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
]

const copyrightYear = new Date().getFullYear()

export default function FooterSectionV2() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Card className="rounded-none">
          <CardHeader className="block px-6 py-7 md:px-8 md:py-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {footerColumns.map((column) => (
                <div key={column.title} className="space-y-3">
                  <h2 className="text-sm font-medium text-muted-foreground">{column.title}</h2>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-0.5 text-sm text-card-foreground no-underline transition-colors hover:text-card-foreground/80"
                        >
                          <span>{link.label}</span>
                          {link.externalArrow ? (
                            <ArrowUpRight
                              aria-hidden
                              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none group-hover:translate-x-px group-hover:-translate-y-px group-hover:opacity-100"
                            />
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardHeader>
          <div className="border-border px-6 py-5 md:px-8 md:py-6">
            <div className="text-sm text-muted-foreground">
              © {copyrightYear}{" "}
              <Link
                href="#"
                className="font-medium text-card-foreground no-underline transition-colors hover:text-card-foreground/70"
              >
                uiception
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
