"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { XIcon } from "lucide-react"

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

type DropdownItem = {
  label: string
  href: string
  external?: boolean
}

const PRODUCT_ITEMS: DropdownItem[] = [
  { label: "Chat", href: "#" },
  { label: "Agents", href: "#" },
  { label: "Workflows", href: "#" },
  { label: "Enterprise", href: "#" },
]

const DEVELOPERS_ITEMS: DropdownItem[] = [
  { label: "Documentation", href: "#" },
  { label: "API Reference", href: "#" },
  { label: "SDKs", href: "#" },
  { label: "Playground", href: "#" },
  { label: "Status", href: "#", external: true },
]

const DROPDOWN_PANELS = {
  product: PRODUCT_ITEMS,
  developers: DEVELOPERS_ITEMS,
} as const

const DROPDOWN_LABELS: Record<keyof typeof DROPDOWN_PANELS, string> = {
  product: "Product",
  developers: "Developers",
}

type NavLinkItem = {
  kind: "link"
  label: string
  href: string
  external?: boolean
}

type NavDropdownItem = {
  kind: "dropdown"
  label: string
  href: string
  panelId: keyof typeof DROPDOWN_PANELS
}

type NavEntry = NavLinkItem | NavDropdownItem

const NAV_ENTRIES: NavEntry[] = [
  { kind: "dropdown", label: "Product", href: "#", panelId: "product" },
  { kind: "dropdown", label: "Developers", href: "#", panelId: "developers" },
  { kind: "link", label: "Pricing", href: "#" },
  { kind: "link", label: "Shop", href: "#", external: true },
  { kind: "link", label: "About", href: "#" },
]

const CTA = { label: "Get started", href: "#" }

type OpenDropdown = keyof typeof DROPDOWN_PANELS | null

const linkClass = cn(
  "shrink-0 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
  "aria-[current=page]:text-foreground"
)

const sheetLinkClass = cn(
  "block py-2 text-lg font-medium uppercase tracking-tight text-foreground transition-colors hover:text-muted-foreground",
  "aria-[current=page]:text-muted-foreground"
)

const sheetSubLinkClass =
  "block rounded-md py-1.5 pl-3 text-sm uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"

const hoverPanelLinkClass =
  "shrink-0 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"

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

function DropdownLink({
  item,
  className,
  onSelect,
}: {
  item: DropdownItem
  className?: string
  onSelect?: () => void
}) {
  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    onSelect?.()
  }

  if (item.external) {
    return (
      <a
        className={className ?? hoverPanelLinkClass}
        href={item.href}
        rel="noopener noreferrer"
        target="_blank"
        onClick={handleClick}
      >
        {item.label}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }

  return (
    <a
      className={className ?? hoverPanelLinkClass}
      href={item.href}
      onClick={handleClick}
    >
      {item.label}
    </a>
  )
}

function NavLink({
  item,
  isActive,
  onSelect,
  className,
}: {
  item: NavLinkItem
  isActive: boolean
  onSelect: () => void
  className?: string
}) {
  const shared = className ?? linkClass
  const handleClick = (e: { preventDefault: () => void }) => {
    if (!item.external) {
      e.preventDefault()
    }
    onSelect()
  }

  if (item.external) {
    return (
      <a
        aria-current={isActive ? "page" : undefined}
        className={shared}
        href={item.href}
        rel="noopener noreferrer"
        target="_blank"
        onClick={handleClick}
      >
        {item.label}
        <span className="sr-only"> (opens in new tab)</span>
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

function NavDropdownTrigger({
  entry,
  panelId,
  isActive,
  isOpen,
  onOpen,
  onClose,
}: {
  entry: NavDropdownItem
  panelId: OpenDropdown
  isActive: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <Link
      href={entry.href}
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-controls={isOpen ? `nav-hover-panel-${panelId}` : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        linkClass,
        "inline-flex cursor-default rounded-md",
        isOpen && "text-foreground"
      )}
      onClick={(e) => e.preventDefault()}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
    >
      {entry.label}
    </Link>
  )
}

function NavHoverPanel({
  panelId,
  items,
  onPointerEnter,
  onPointerLeave,
}: {
  panelId: NonNullable<OpenDropdown>
  items: DropdownItem[]
  onPointerEnter: () => void
  onPointerLeave: () => void
}) {
  return (
    <div
      id={`nav-hover-panel-${panelId}`}
      role="region"
      aria-label={`${DROPDOWN_LABELS[panelId]} menu`}
      className="animate-hover-panel-in w-full border-y border-border/80 bg-background"
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    >
      <nav
        aria-label={DROPDOWN_LABELS[panelId]}
        className="mx-auto flex min-h-14 w-full max-w-7xl items-center justify-start gap-8 px-6 py-4 lg:gap-12 xl:gap-16"
      >
        {items.map((item) => (
          <DropdownLink key={item.label} item={item} />
        ))}
      </nav>
    </div>
  )
}

export function NavbarSectionV7Root({ logoSrc }: { logoSrc: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null)
  const hoverPanelTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const cancelHoverClose = () => {
    clearTimeout(hoverPanelTimerRef.current)
  }

  const openDropdownPanel = (id: NonNullable<OpenDropdown>) => {
    cancelHoverClose()
    setOpenDropdown(id)
  }

  const closeDropdownPanel = () => {
    cancelHoverClose()
    hoverPanelTimerRef.current = setTimeout(() => setOpenDropdown(null), 100)
  }

  const selectNavItem = (index: number) => {
    setActiveIndex(index)
    setMenuOpen(false)
    setOpenDropdown(null)
  }

  const hoverPanelItems = openDropdown ? DROPDOWN_PANELS[openDropdown] : null

  return (
    <>
      <style>{`
        @keyframes hover-panel-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-hover-panel-in {
          animation: hover-panel-in 0.14s cubic-bezier(0.4,0,0.2,1) both;
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
            <SheetTitle className="flex items-center gap-2 text-base font-medium tracking-tight">
              <Image
                alt=""
                aria-hidden
                className="size-5 shrink-0"
                height={32}
                src={logoSrc}
                unoptimized
                width={32}
              />
              {SITE_NAME}
            </SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <button
              type="button"
              className="absolute top-4 right-4 z-10 inline-flex rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="Close menu"
            >
              <XIcon className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </SheetClose>

          <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 p-4">
            {NAV_ENTRIES.map((entry, i) => {
              if (entry.kind === "dropdown") {
                return (
                  <div key={entry.label} className="pt-1">
                    <p
                      className={cn(
                        sheetLinkClass,
                        activeIndex === i && "text-muted-foreground"
                      )}
                    >
                      {entry.label}
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {DROPDOWN_PANELS[entry.panelId].map((item) => (
                        <li key={item.label}>
                          <DropdownLink
                            item={item}
                            className={sheetSubLinkClass}
                            onSelect={() => selectNavItem(i)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }

              return (
                <NavLink
                  key={entry.label}
                  item={entry}
                  isActive={activeIndex === i}
                  className={sheetLinkClass}
                  onSelect={() => selectNavItem(i)}
                />
              )
            })}
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
        <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-6">
          <div className="flex min-w-0 items-center gap-5 lg:gap-6 xl:gap-8">
            <Link
              aria-label={`${SITE_NAME} home`}
              className="inline-flex shrink-0"
              href={LOGO_HREF}
              onClick={(e) => e.preventDefault()}
            >
              <Image
                alt=""
                aria-hidden
                className="size-6 shrink-0"
                height={32}
                src={logoSrc}
                unoptimized
                width={32}
              />
            </Link>

            <nav
              aria-label="Primary"
              className="hidden min-w-0 overflow-visible md:block"
            >
              <div className="flex items-center gap-5 overflow-visible lg:gap-6 xl:gap-8">
                {NAV_ENTRIES.map((entry, i) => {
                  if (entry.kind === "dropdown") {
                    return (
                      <NavDropdownTrigger
                        key={entry.label}
                        entry={entry}
                        panelId={entry.panelId}
                        isActive={activeIndex === i}
                        isOpen={openDropdown === entry.panelId}
                        onOpen={() => openDropdownPanel(entry.panelId)}
                        onClose={closeDropdownPanel}
                      />
                    )
                  }

                  return (
                    <NavLink
                      key={entry.label}
                      item={entry}
                      isActive={activeIndex === i}
                      onSelect={() => setActiveIndex(i)}
                    />
                  )
                })}
              </div>
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Button
              asChild
              variant="outline"
              className="hidden h-8 rounded-full px-4 text-xs uppercase md:inline-flex"
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

        {hoverPanelItems && openDropdown ? (
          <NavHoverPanel
            panelId={openDropdown}
            items={hoverPanelItems}
            onPointerEnter={cancelHoverClose}
            onPointerLeave={closeDropdownPanel}
          />
        ) : null}
      </header>
    </>
  )
}
