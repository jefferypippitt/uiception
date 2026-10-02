import Link from "next/link"

import { LinkedinIcon } from "@/components/ui/svgs/linkedinIcon"
import { LinkedinIconDark } from "@/components/ui/svgs/linkedinIconDark"
import { X } from "@/components/ui/svgs/x"
import { XDark } from "@/components/ui/svgs/xDark"
import { Youtube } from "@/components/ui/svgs/youtube"

import ContactForm from "./contact-form"

export default function ContactSectionV1() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-4 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-between gap-16">
          <h2 className="text-5xl font-light tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Let&apos;s collaborate
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-medium text-foreground">Find us</p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                aria-label="YouTube"
                className="transition-opacity hover:opacity-70"
              >
                <Youtube className="h-5 w-auto" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-70"
              >
                <LinkedinIcon className="size-5 dark:hidden" />
                <LinkedinIconDark className="hidden size-5 dark:block" />
              </Link>
              <Link
                href="#"
                aria-label="X"
                className="transition-opacity hover:opacity-70"
              >
                <X className="size-5 dark:hidden" />
                <XDark className="hidden size-5 dark:block" />
              </Link>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
