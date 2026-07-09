"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ChevronDownIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? ""
const SITE_NAME = "uiception"
const LOGO_SRC = `${mediaOrigin}/images/blocks/navbar-section-v8/logo.svg`
const LOGO_HREF = "#"
const DROPDOWN_LABEL = "Product"

type PlatformItem = {
  label: string
  description: string
  href: string
}

const PLATFORM_ITEMS: PlatformItem[] = [
  {
    label: "Dashboard",
    description:
      "Get a real-time overview of your workspace activity and key metrics.",
    href: "#",
  },
  {
    label: "Analytics",
    description:
      "Uncover trends, track goals, and make data-driven decisions with ease.",
    href: "#",
  },
  {
    label: "Automation",
    description:
      "Build powerful workflows that eliminate repetitive tasks and save hours.",
    href: "#",
  },
  {
    label: "Integrations",
    description:
      "Connect with the tools your team already uses for a seamless experience.",
    href: "#",
  },
]

const PLAIN_NAV_LINKS = [
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
]

const CTA = { label: "Start free", href: "#" }

const linkClass = cn(
  "text-sm text-muted-foreground transition-colors hover:text-foreground",
  "aria-[current=page]:text-foreground"
)

const sheetLinkClass = cn(
  "block py-2 text-lg font-medium uppercase tracking-tight text-foreground transition-colors hover:text-muted-foreground",
  "aria-[current=page]:text-muted-foreground"
)

const sheetSubLinkClass =
  "block rounded-md py-1.5 pl-3 text-sm uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"

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

function PlatformPanel({
  onMouseEnter,
  onMouseLeave,
}: {
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  return (
    <div
      role="region"
      aria-label={`${DROPDOWN_LABEL} menu`}
      className="animate-platform-panel-in w-full border-b border-border/80 bg-background"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          {PLATFORM_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "group rounded-sm p-4 transition-all duration-150 hover:bg-muted/60",
                hoveredLabel !== null && hoveredLabel !== item.label
                  ? "opacity-40"
                  : "opacity-100"
              )}
              onMouseEnter={() => setHoveredLabel(item.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              onClick={(e) => e.preventDefault()}
            >
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NavbarSectionV8() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [platformOpen, setPlatformOpen] = useState(false)
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const openPlatform = () => {
    clearTimeout(closeTimerRef.current)
    setPlatformOpen(true)
  }

  const schedulePlatformClose = () => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setPlatformOpen(false), 100)
  }

  return (
    <>
      <style>{`
        @keyframes platform-panel-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-platform-panel-in {
          animation: platform-panel-in 0.14s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>

      {/* Backdrop overlay */}
      {platformOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60"
          onMouseEnter={schedulePlatformClose}
          onClick={() => setPlatformOpen(false)}
          aria-hidden
        />
      )}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          aria-describedby={undefined}
          showCloseButton={false}
          side="right"
          className="flex w-[min(100vw,20rem)] flex-col gap-0 border-border/80 bg-background p-0 sm:max-w-xs"
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

          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="absolute top-4 right-4 z-10 inline-flex rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <XIcon className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </SheetClose>

          <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 p-4">
            <div>
              <button
                type="button"
                className={cn(
                  sheetLinkClass,
                  "flex w-full items-center justify-between"
                )}
                onClick={() => setMobilePlatformOpen((v) => !v)}
              >
                {DROPDOWN_LABEL}
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform duration-200",
                    mobilePlatformOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              {mobilePlatformOpen && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {PLATFORM_ITEMS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className={sheetSubLinkClass}
                        onClick={(e) => {
                          e.preventDefault()
                          setMenuOpen(false)
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {PLAIN_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={sheetLinkClass}
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-border/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-full uppercase"
            >
              <Link
                href={CTA.href}
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                }}
              >
                {CTA.label}
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-50 bg-background">
        <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          {/* Logo — left */}
          <div className="flex min-w-0 flex-1 items-center">
            <Link
              href={LOGO_HREF}
              aria-label={`${SITE_NAME} home`}
              className="inline-flex min-w-0 items-center gap-2 text-foreground"
              onClick={(e) => e.preventDefault()}
            >
              <Image
                alt=""
                aria-hidden
                className="size-6 shrink-0"
                height={32}
                src={LOGO_SRC}
                unoptimized
                width={32}
              />
              <span className="text-lg tracking-tight">
                {SITE_NAME}
              </span>
            </Link>
          </div>

          {/* Nav links — center */}
          <nav
            aria-label="Primary"
            className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex"
          >
            <div
              onMouseEnter={openPlatform}
              onMouseLeave={schedulePlatformClose}
            >
              <button
                type="button"
                aria-expanded={platformOpen}
                aria-haspopup="true"
                className={cn(
                  linkClass,
                  "inline-flex cursor-default items-center gap-1",
                  platformOpen && "text-foreground"
                )}
              >
                {DROPDOWN_LABEL}
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    platformOpen ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>

            {PLAIN_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(linkClass, "shrink-0")}
                onClick={(e) => e.preventDefault()}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <Button
              asChild
              variant="default"
              className="hidden md:inline-flex"
            >
              <Link href={CTA.href} onClick={(e) => e.preventDefault()}>
                {CTA.label}
              </Link>
            </Button>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="ms-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Product panel — fixed overlay, doesn't push page content */}
      {platformOpen && (
        <div className="fixed top-16 left-0 right-0 z-50">
          <PlatformPanel
            onMouseEnter={openPlatform}
            onMouseLeave={schedulePlatformClose}
          />
        </div>
      )}
    </>
  )
}
