import Image from "next/image"
import Link from "next/link"

import { Card, CardHeader } from "@/components/ui/card"

type FooterLink = {
  label: string
  href: string
}

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Build", href: "#" },
      { label: "Monitor", href: "#" },
      { label: "Plan", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Brand", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Customers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Developers", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Download", href: "#" },
      { label: "Enterprise", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Community", href: "#" },
      { label: "Contact us", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "X (Twitter)", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
]

export default function FooterSectionV3() {
  const logoImage = {
    src: "https://uiception.com/images/blocks/footer-section-v3/logo.svg",
    alt: "Logo",
  } as const

  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Card className="rounded-none">
          <CardHeader className="block px-6 py-7 md:px-8 md:py-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]">

              <div className="col-span-2 lg:col-span-1">
                <Link href="#" className="inline-flex w-fit">
                  <Image
                    alt={logoImage.alt}
                    src={logoImage.src}
                    width={32}
                    height={32}
                    className="size-8 shrink-0"
                    unoptimized
                  />
                </Link>
              </div>

              {footerColumns.map((column) => (
                <div key={column.title} className="space-y-3">
                  <h2 className="text-sm font-medium text-card-foreground">
                    {column.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground no-underline transition-colors hover:text-card-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardHeader>
          <div className="border-border px-6 py-5 md:px-8 md:py-6">
            <div className="grid grid-cols-2 gap-x-8 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
              <div className="hidden lg:block" />
              <div className="flex gap-6">
                <Link
                  href="#"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-card-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground no-underline transition-colors hover:text-card-foreground"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
