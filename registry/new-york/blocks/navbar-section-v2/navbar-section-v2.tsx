"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ChevronRightIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type ProductItem = {
  label: string
  href: string
  external?: boolean
}

const PRODUCT_ITEMS: ProductItem[] = [
  { label: "Overview", href: "#" },
  { label: "Features", href: "#" },
  { label: "Changelog", href: "#", external: true },
  { label: "Roadmap", href: "#" },
]

const NAV_LINKS = [
  { label: "Enterprise", href: "#" },
  { label: "Pricing", href: "#" },
]

const RESOURCE_COLUMNS: { label: string; href: string }[][] = [
  [
    { label: "Documentation", href: "#" },
    { label: "API reference", href: "#" },
  ],
  [
    { label: "Blog", href: "#" },
    { label: "Support", href: "#" },
  ],
]

const dropdownSurfaceClass =
  "animate-dropdown-in absolute top-full z-60 mt-2 max-h-[min(70vh,24rem)] rounded-xl border border-border bg-background/98 shadow-md shadow-black/4 backdrop-blur-md dark:shadow-black/20"

const dropdownItemClass =
  "block whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm leading-none text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"

type SheetNavEntry =
  | { kind: "link"; label: string; href: string }
  | { kind: "resources" }

const SHEET_NAV_ENTRIES: SheetNavEntry[] = [
  { kind: "link", label: "Product", href: "#" },
  ...NAV_LINKS.map(({ label, href }) => ({
    kind: "link" as const,
    label,
    href,
  })),
  { kind: "resources" },
]

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

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

export default function NavbarSectionV2() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const hoverPanelTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const cancelHoverClose = () => {
    clearTimeout(hoverPanelTimerRef.current)
  }

  const openProduct = () => {
    cancelHoverClose()
    setResourcesOpen(false)
    setProductOpen(true)
  }

  const closeProduct = () => {
    cancelHoverClose()
    hoverPanelTimerRef.current = setTimeout(() => setProductOpen(false), 120)
  }

  const openResources = () => {
    cancelHoverClose()
    setProductOpen(false)
    setResourcesOpen(true)
  }

  const closeResources = () => {
    cancelHoverClose()
    hoverPanelTimerRef.current = setTimeout(() => setResourcesOpen(false), 120)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur transition-colors duration-300">
      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown-in {
          animation: dropdown-in 0.18s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          aria-describedby={undefined}
          showCloseButton={false}
          side="right"
          className={cn(
            "z-50 flex h-dvh max-h-dvh min-h-dvh flex-col overflow-y-auto overscroll-none rounded-none border-0 p-0 shadow-none sm:rounded-none",
            "data-[side=right]:inset-x-0! data-[side=right]:inset-y-0! data-[side=right]:top-0! data-[side=right]:right-0! data-[side=right]:bottom-0! data-[side=right]:left-0!",
            "data-[side=right]:w-screen! data-[side=right]:max-w-none! data-[side=right]:sm:max-w-none!",
            "border-l-0!",
            "bg-zinc-950 text-zinc-50"
          )}
          style={{
            width: "100vw",
            maxWidth: "100vw",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="sr-only shrink-0 p-6">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <button
              type="button"
              className="absolute top-8 right-8 z-10 inline-flex rounded-md p-2 text-zinc-50 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
              aria-label="Close menu"
            >
              <XIcon className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </SheetClose>

          <nav
            aria-label="Primary"
            className="flex min-h-dvh flex-col justify-start px-8 pt-[24dvh]"
          >
            <ul className="flex flex-col gap-2">
              {SHEET_NAV_ENTRIES.map((entry) =>
                entry.kind === "link" ? (
                  <li key={entry.label}>
                    <a
                      className={cn(
                        "block py-1.5 text-[1.6875rem] leading-snug font-medium tracking-tight text-zinc-50",
                        "transition-colors hover:text-zinc-400"
                      )}
                      href={entry.href}
                      onClick={(e) => {
                        e.preventDefault()
                        setMenuOpen(false)
                      }}
                    >
                      {entry.label}
                    </a>
                  </li>
                ) : (
                  <li key="resources-sheet" className="pt-1">
                    <p className="py-1.5 text-[1.6875rem] leading-snug font-medium tracking-tight text-zinc-50">
                      Resources
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2">
                      {RESOURCE_COLUMNS.map((col, colIdx) => (
                        <ul key={colIdx} className="flex flex-col gap-2">
                          {col.map(({ label, href }) => (
                            <li key={label}>
                              <a
                                className="block rounded-md py-1 text-base leading-snug text-zinc-400 transition-colors hover:text-zinc-50"
                                href={href}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setMenuOpen(false)
                                }}
                              >
                                {label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </li>
                )
              )}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Link
            aria-label="Homepage"
            className="inline-flex min-w-0 items-center gap-2 font-medium tracking-tight"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <Image
              alt=""
              aria-hidden
              className="size-6 shrink-0"
              height={32}
              src="/icon0.svg"
              width={32}
            />
            <span className="text-lg tracking-tight">uiception</span>
          </Link>
        </div>

        <nav className="absolute top-1/2 left-1/2 z-10 hidden min-w-0 -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex">
          <div
            className="relative w-fit shrink-0"
            onMouseEnter={openProduct}
            onMouseLeave={closeProduct}
          >
            <button
              type="button"
              aria-expanded={productOpen}
              aria-haspopup="menu"
              className={cn(
                linkClass,
                "inline-flex cursor-default items-center rounded-md"
              )}
              onClick={(e) => e.preventDefault()}
            >
              Product
            </button>

            {productOpen && (
              <div
                className={cn(
                  dropdownSurfaceClass,
                  "left-0 max-w-[calc(100vw-2rem)] min-w-38 overflow-auto overflow-x-hidden p-0.5"
                )}
                onMouseEnter={openProduct}
                onMouseLeave={closeProduct}
              >
                <div className="flex flex-col py-0.5">
                  {PRODUCT_ITEMS.map((item) => {
                    const external = Boolean(item.external)
                    return (
                      <a
                        key={item.label}
                        className={cn(
                          dropdownItemClass,
                          "flex items-center gap-1.5",
                          external && "group/changelog"
                        )}
                        href={item.href}
                        onClick={(e) => {
                          if (!external) e.preventDefault()
                        }}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.label}
                        {external ? (
                          <span className="sr-only"> (opens in new tab)</span>
                        ) : null}
                        {external ? (
                          <ChevronRightIcon
                            aria-hidden
                            className="size-3.5 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover/changelog:translate-x-0 group-hover/changelog:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-70 motion-reduce:group-hover/changelog:translate-x-0"
                          />
                        ) : null}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              className={cn(linkClass, "shrink-0")}
              href={href}
              onClick={(e) => e.preventDefault()}
            >
              {label}
            </a>
          ))}

          <div
            className="relative w-fit shrink-0"
            onMouseEnter={openResources}
            onMouseLeave={closeResources}
          >
            <button
              type="button"
              aria-expanded={resourcesOpen}
              aria-haspopup="menu"
              className={cn(
                linkClass,
                "inline-flex cursor-default items-center rounded-md"
              )}
              onClick={(e) => e.preventDefault()}
            >
              Resources
            </button>

            {resourcesOpen && (
              <div
                className={cn(
                  dropdownSurfaceClass,
                  "left-0 w-max max-w-[calc(100vw-2rem)] overflow-auto overflow-x-hidden p-0.5"
                )}
                onMouseEnter={openResources}
                onMouseLeave={closeResources}
              >
                <div className="grid grid-cols-2 gap-x-5 gap-y-1 px-1.5 py-1.5">
                  {RESOURCE_COLUMNS.map((col, colIdx) => (
                    <ul key={colIdx} className="flex min-w-0 flex-col gap-0.5">
                      {col.map(({ label, href }) => (
                        <li key={label}>
                          <a
                            href={href}
                            className={dropdownItemClass}
                            onClick={(e) => e.preventDefault()}
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <Button asChild variant="outline" className="rounded-4xl">
            <Link href="#" onClick={(e) => e.preventDefault()}>
              Sign in
            </Link>
          </Button>
          <Button asChild variant="default" className="rounded-4xl">
            <Link href="#" onClick={(e) => e.preventDefault()}>
              Get started
            </Link>
          </Button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="ms-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  )
}
