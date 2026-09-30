import Image from "next/image"
import Link from "next/link"

import { LinkedinIcon } from "@/components/ui/svgs/linkedinIcon"
import { LinkedinIconDark } from "@/components/ui/svgs/linkedinIconDark"
import { X } from "@/components/ui/svgs/x"
import { XDark } from "@/components/ui/svgs/xDark"
import { createBlockImage } from "@/lib/block-media"

import {
  footerColumn,
  footerLegal,
  footerMeta,
  footerSocial,
  type FooterSocialLink,
} from "../lib/footer-content"

const blockImage = createBlockImage("footer-section-v5")
const LOGO_SRC = blockImage("logo.svg")

function SocialIcons({
  icon,
}: {
  icon: FooterSocialLink["icon"]
}) {
  switch (icon) {
    case "linkedin":
      return (
        <>
          <LinkedinIcon className="size-4 dark:hidden" />
          <LinkedinIconDark className="hidden size-4 dark:block" />
        </>
      )
    case "x":
      return (
        <>
          <X className="size-4 dark:hidden" />
          <XDark className="hidden size-4 dark:block" />
        </>
      )
    default: {
      const exhaustive: never = icon
      return exhaustive
    }
  }
}

export default function FooterSectionV5() {
  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto flex min-h-128 w-full max-w-7xl flex-col justify-between gap-20 px-6 py-14 sm:px-8 md:min-h-152 md:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="#"
            className="inline-flex w-fit items-center gap-2.5 text-foreground"
          >
            <Image
              alt="Logo"
              src={LOGO_SRC}
              width={32}
              height={32}
              className="size-6 shrink-0 grayscale"
              unoptimized
            />
            <span className="text-[1.0625rem] font-medium tracking-[-0.02em]">
              {footerMeta.name}
            </span>
          </Link>

          <div className="flex flex-col items-start">
            <p className="text-xs text-muted-foreground">{footerColumn.title}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {footerColumn.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.9375rem] leading-snug text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex items-center gap-3.5">
              {footerSocial.map((item) => (
                <li key={item.icon}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className="text-foreground transition-colors hover:text-muted-foreground"
                  >
                    <SocialIcons icon={item.icon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-[0.8125rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{footerMeta.copyright}</p>
          <ul className="flex items-center gap-8">
            {footerLegal.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
