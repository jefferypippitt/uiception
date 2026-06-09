"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? ""
const SITE_NAME = "uiception"
const LOGO_SRC = `${mediaOrigin}/images/blocks/navbar-section-v5/logo.svg`
const LOGO_HREF = "#"

type NavItem = {
  label: string
  href: string
  external?: boolean
}

const LEFT_NAV_ITEMS: NavItem[] = [
  { label: "Pricing", href: "#" },
  { label: "Community", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
]

const SIGN_IN_ITEM: NavItem = { label: "Sign in", href: "#" }

const linkClass = cn(
  "shrink-0 rounded-full px-2 py-1.5 text-xs whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-sm",
  "aria-[current=page]:text-foreground"
)

const mobileSheetLinkClass = cn(
  "block rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
  "aria-[current=page]:bg-muted/60 aria-[current=page]:text-foreground"
)

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex size-4 flex-col items-center justify-center gap-1">
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "translate-y-[5px] rotate-45" : ""
        )}
      />
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "scale-x-0 opacity-0" : ""
        )}
      />
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "-translate-y-[5px] -rotate-45" : ""
        )}
      />
    </div>
  )
}

function getScrollTop() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  )
}

function NavLink({
  item,
  isActive,
  onSelect,
  className,
}: {
  item: NavItem
  isActive: boolean
  onSelect: () => void
  className?: string
}) {
  const shared = cn(className ?? linkClass)
  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    onSelect()
  }

  if (item.external) {
    return (
      <a
        aria-current={isActive ? "page" : undefined}
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
      aria-current={isActive ? "page" : undefined}
      className={shared}
      href={item.href}
      onClick={handleClick}
    >
      {item.label}
    </a>
  )
}

export default function NavbarSectionV5() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(getScrollTop() > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("scroll", onScroll)
    }
  }, [])

  const signInIndex = LEFT_NAV_ITEMS.length

  const selectNavItem = (index: number) => {
    setActiveIndex(index)
    setMenuOpen(false)
  }

  return (
    <>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          className="flex w-[min(100vw,20rem)] flex-col gap-0 border-border/80 p-0 sm:max-w-xs"
        >
          <SheetHeader className="border-b border-border/80 px-5 py-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-base font-medium tracking-tight">
              <Image
                alt=""
                aria-hidden
                className="size-5 shrink-0"
                height={32}
                src={LOGO_SRC}
                unoptimized
                width={32}
              />
              {SITE_NAME}
            </SheetTitle>
          </SheetHeader>

          <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 p-3">
            {LEFT_NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.label}
                item={item}
                isActive={activeIndex === i}
                className={mobileSheetLinkClass}
                onSelect={() => selectNavItem(i)}
              />
            ))}
            <div className="mt-2 border-t border-border/80 pt-3">
              <NavLink
                item={SIGN_IN_ITEM}
                isActive={activeIndex === signInIndex}
                className={mobileSheetLinkClass}
                onSelect={() => selectNavItem(signInIndex)}
              />
            </div>
          </nav>

          <div className="border-t border-border/80 p-4">
            <Button asChild className="h-10 w-full rounded-full">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
              >
                Get started
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <header
        className={cn(
          "sticky top-0 z-40 flex w-full justify-center",
          "pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-3",
          "transition-[padding,background-color,backdrop-filter] duration-300 ease-out",
          (scrolled || menuOpen) && "bg-background/60 pb-2 backdrop-blur-md"
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex justify-center px-4 transition-[width,max-width] duration-300 ease-out",
            scrolled
              ? "w-[calc(100%-2rem)] max-w-5xl"
              : "w-[calc(100%-0.5rem)] max-w-6xl"
          )}
        >
          <div
            className={cn(
              "grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-full border border-foreground/10 bg-background/80 py-1 pr-1 pl-2 shadow-lg shadow-foreground/5 backdrop-blur",
              "sm:gap-2 sm:p-1 sm:pr-1.5 sm:pl-3",
              "transition-shadow duration-300 ease-out",
              scrolled && "shadow-md shadow-foreground/4"
            )}
          >
            <div className="flex min-w-0 items-center gap-1 md:gap-2">
              <Link
                aria-label={`${SITE_NAME} home`}
                className="inline-flex min-w-0 shrink-0 items-center gap-1.5 rounded-full py-1 pr-1 text-foreground transition-opacity hover:opacity-80"
                href={LOGO_HREF}
                onClick={(e) => e.preventDefault()}
              >
                <Image
                  alt=""
                  aria-hidden
                  className="size-5 shrink-0 sm:size-6"
                  height={32}
                  src={LOGO_SRC}
                  width={32}
                />
                <span className="truncate text-sm font-medium tracking-tight">
                  {SITE_NAME}
                </span>
              </Link>

              <span
                aria-hidden
                className="hidden h-4 w-px shrink-0 bg-foreground/15 md:block"
              />

              <div className="hidden min-w-0 items-center gap-0.5 md:flex md:gap-1">
                {LEFT_NAV_ITEMS.map((item, i) => (
                  <NavLink
                    key={item.label}
                    item={item}
                    isActive={activeIndex === i}
                    onSelect={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:hidden"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <HamburgerIcon open={menuOpen} />
              </button>

              <NavLink
                item={SIGN_IN_ITEM}
                isActive={activeIndex === signInIndex}
                className={cn(linkClass, "hidden md:block")}
                onSelect={() => setActiveIndex(signInIndex)}
              />

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
          </div>
        </nav>
      </header>
    </>
  )
}
