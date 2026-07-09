"use client"

import { useRef, useState } from "react"
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

const SITE_NAME = "uiception"
const LOGO_HREF = "#"

const NAV_LINKS = [
  { label: "Developers", href: "#" },
  { label: "Pricing", href: "#" },
] as const

const RESOURCES_COLUMNS = [
  {
    label: "Company",
    links: [
      { label: "Team", href: "#" },
      { label: "Research", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    label: "Start building",
    links: [
      { label: "Developers", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Success stories", href: "#" },
      { label: "Interactive Avatars", href: "#" },
    ],
  },
] as const

const CTA = { label: "Sign in", href: "#" }

const linkClass = cn(
  "text-sm text-muted-foreground transition-colors hover:text-foreground",
  "aria-[current=page]:text-foreground"
)

const sheetLinkClass = cn(
  "block py-2 text-lg font-medium tracking-tight text-foreground transition-colors hover:text-muted-foreground",
  "aria-[current=page]:text-muted-foreground"
)

const sheetSubLinkClass =
  "block rounded-md py-1.5 pl-3 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"

const megaLinkClass =
  "block text-right text-base font-semibold text-foreground transition-colors hover:text-muted-foreground"

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

function ResourcesPanel({
  onMouseEnter,
  onMouseLeave,
}: {
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <section
      aria-label="Resources menu"
      className="animate-resources-panel-in w-full bg-background"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto flex w-full max-w-7xl justify-end px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-16">
          {RESOURCES_COLUMNS.map((column) => (
            <div key={column.label} className="text-right">
              <p className="mb-4 text-xs text-muted-foreground">
                {column.label}
              </p>
              <ul className="flex flex-col gap-5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={megaLinkClass}
                      onClick={(e) => e.preventDefault()}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function NavbarSectionV9() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const openResources = () => {
    clearTimeout(closeTimerRef.current)
    setResourcesOpen(true)
  }

  const scheduleResourcesClose = () => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setResourcesOpen(false), 100)
  }

  return (
    <>
      <style>{`
        @keyframes resources-panel-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-resources-panel-in {
          animation: resources-panel-in 0.35s ease both;
        }
      `}</style>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          aria-describedby={undefined}
          showCloseButton={false}
          side="right"
          className="flex w-[min(100vw,20rem)] flex-col gap-0 border-border/80 bg-background p-0 sm:max-w-xs"
        >
          <SheetHeader className="border-b border-border/80 px-5 py-4 text-left">
            <SheetTitle className="text-base font-medium tracking-tight">
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
            {NAV_LINKS.map((link) => (
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

            <div>
              <button
                type="button"
                className={cn(
                  sheetLinkClass,
                  "flex w-full items-center justify-between"
                )}
                onClick={() => setMobileResourcesOpen((v) => !v)}
              >
                Resources
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform duration-200",
                    mobileResourcesOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              {mobileResourcesOpen && (
                <div className="mt-2 flex flex-col gap-4">
                  {RESOURCES_COLUMNS.map((column) => (
                    <div key={column.label}>
                      <p className="mb-2 pl-3 text-xs text-muted-foreground">
                        {column.label}
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className={sheetSubLinkClass}
                              onClick={(e) => {
                                e.preventDefault()
                                setMenuOpen(false)
                              }}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="border-t border-border/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            <Button
              asChild
              variant="default"
              className="h-10 w-full"
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

      <div className="sticky top-0 z-50 bg-background">
        <header>
          <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-6">
          <Link
            href={LOGO_HREF}
            aria-label={`${SITE_NAME} home`}
            className="text-xl font-medium tracking-tight text-foreground"
            onClick={(e) => e.preventDefault()}
          >
            {SITE_NAME}
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-6">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-6 md:flex"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(linkClass, "shrink-0")}
                  onClick={(e) => e.preventDefault()}
                >
                  {link.label}
                </a>
              ))}

              <button
                type="button"
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                className={cn(
                  linkClass,
                  "inline-flex cursor-default items-center",
                  resourcesOpen && "text-foreground"
                )}
                onMouseEnter={openResources}
                onMouseLeave={scheduleResourcesClose}
                onFocus={openResources}
                onBlur={scheduleResourcesClose}
              >
                Resources
              </button>
            </nav>

            <Button
              asChild
              variant="default"
              className="hidden h-8 px-4 text-sm md:inline-flex"
            >
              <Link href={CTA.href} onClick={(e) => e.preventDefault()}>
                {CTA.label}
              </Link>
            </Button>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
        </header>

        {resourcesOpen && (
          <ResourcesPanel
            onMouseEnter={openResources}
            onMouseLeave={scheduleResourcesClose}
          />
        )}
      </div>
    </>
  )
}
