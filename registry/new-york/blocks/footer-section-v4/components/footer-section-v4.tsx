import Image from "next/image"
import Link from "next/link"

import { createBlockImage } from "@/lib/block-media"

import { footerColumns, footerMeta } from "../lib/footer-content"

const blockImage = createBlockImage("footer-section-v4")
const LOGO_SRC = blockImage("logo.svg")

export default function FooterSectionV4() {
  return (
    <section className="relative overflow-hidden bg-background py-4 md:py-6 lg:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 md:gap-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <Link
            href="#"
            className="inline-flex w-fit items-center gap-2 font-medium tracking-tight text-foreground"
          >
            <Image
              alt="Logo"
              src={LOGO_SRC}
              width={32}
              height={32}
              className="size-8 shrink-0"
              unoptimized
            />
            <span className="text-lg tracking-tight">{footerMeta.name}</span>
          </Link>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-16">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm text-muted-foreground/70">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{footerMeta.copyright}</p>
          <p>{footerMeta.offices}</p>
        </div>
      </div>
    </section>
  )
}
