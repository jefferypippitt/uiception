"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  external?: boolean
  signInSpacing?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#", external: true },
  { label: "Sign in", href: "#", signInSpacing: true },
]

const linkClass = cn(
  "relative shrink-0 whitespace-nowrap rounded-full px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground",
  /* bottom-1 on mobile: inside link box so overflow-x-auto scrollport does not clip. sm: negative offset matches desktop dock reference. */
  "after:pointer-events-none after:absolute after:bottom-1 after:left-2 after:right-2 after:h-px after:bg-foreground after:opacity-0 after:transition-opacity sm:after:-bottom-[5px] sm:px-3 sm:text-sm sm:after:left-3 sm:after:right-3",
  "aria-[current=page]:text-foreground aria-[current=page]:after:opacity-100",
)

export default function NavbarSectionV4() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed left-1/2 z-40 flex justify-center",
        "-translate-x-1/2",
        "bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] w-[calc(100vw-1rem)] max-w-xl",
        "sm:bottom-6 sm:w-auto sm:max-w-none",
      )}
    >
      <div
        className={cn(
          "flex max-w-full flex-nowrap items-center gap-0.5 overflow-x-auto overscroll-x-contain rounded-full border border-foreground/10 bg-background/80 px-1 py-1 pb-2 pl-2 shadow-lg shadow-foreground/5 backdrop-blur",
          "touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:touch-auto sm:gap-1 sm:overflow-visible sm:p-1 sm:pl-3 sm:pb-1",
        )}
      >
        {NAV_ITEMS.map((item, i) => {
          const shared = cn(
            linkClass,
            item.signInSpacing && "ml-1 sm:ml-2",
          )
          const handleClick = (e: { preventDefault: () => void }) => {
            e.preventDefault()
            setActiveIndex(i)
          }
          if (item.external) {
            return (
              <a
                key={item.label}
                aria-current={activeIndex === i ? "page" : undefined}
                className={shared}
                href={item.href}
                rel="noreferrer"
                target="_blank"
                onClick={handleClick}
              >
                {item.label}
              </a>
            )
          }
          return (
            <a
              key={item.label}
              aria-current={activeIndex === i ? "page" : undefined}
              className={shared}
              href={item.href}
              onClick={handleClick}
            >
              {item.label}
            </a>
          )
        })}
        <Button
          asChild
          className="h-7 shrink-0 gap-1 rounded-full px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 sm:h-8 sm:px-3 sm:text-sm"
          size="sm"
        >
          <Link href="#" onClick={(e) => e.preventDefault()}>
            Get started
          </Link>
        </Button>
      </div>
    </nav>
  )
}
