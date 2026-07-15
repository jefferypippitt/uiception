"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"


const NAV_LINKS = [
  { label: "Changelog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
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

export function NavbarSectionV3Root({ logoSrc }: { logoSrc: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const DEMO_URL = "#"

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setLoginOpen((v) => !v)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        window.open(DEMO_URL, "_blank", "noopener,noreferrer")
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const updateBlob = (i: number) => {
    const link = linkRefs.current[i]
    const container = containerRef.current
    if (!link || !container) return
    const lr = link.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    setBlobStyle({ left: lr.left - cr.left, width: lr.width })
  }

  return (
    <>
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Welcome back</DialogTitle>
            <DialogDescription>
              Sign in to your uiception account.
            </DialogDescription>
          </DialogHeader>
          <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setLoginOpen(false)
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <svg
          className="pointer-events-none absolute"
          style={{ width: 0, height: 0 }}
          aria-hidden
        >
          <defs>
            <filter
              id="goo-nav-v3"
              x="-30%"
              y="-100%"
              width="160%"
              height="300%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="6"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

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
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      className={cn(
                        "block py-1.5 text-[1.6875rem] leading-snug font-medium tracking-tight text-zinc-50",
                        "transition-colors hover:text-zinc-400"
                      )}
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

              <div className="mt-10 flex flex-col gap-3">
                <Button
                  variant="secondary"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setMenuOpen(false)
                    setLoginOpen(true)
                  }}
                >
                  Login
                  <Kbd data-icon="inline-end" className="translate-x-0.5">
                    ⌘K
                  </Kbd>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full justify-center gap-2"
                >
                  <a
                    href={DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Request Demo
                    <Kbd data-icon="inline-end" className="translate-x-0.5">
                      ⏎
                    </Kbd>
                  </a>
                </Button>
              </div>
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
                src={logoSrc}
                unoptimized
                width={32}
              />
              <span className="text-lg tracking-tight">uiception</span>
            </Link>
          </div>

          <div className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div ref={containerRef} className="relative">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ filter: "url(#goo-nav-v3)" }}
                aria-hidden
              >
                <div
                  className={cn(
                    "absolute top-1/2 h-8 -translate-y-1/2 rounded-sm bg-muted",
                    "transition-[left,width,opacity] duration-200 ease-out",
                    hoveredIndex !== null ? "opacity-100" : "opacity-0"
                  )}
                  style={{ left: blobStyle.left, width: blobStyle.width }}
                />
              </div>

              <nav
                className="flex items-center"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {NAV_LINKS.map(({ label, href }, i) => (
                  <a
                    key={label}
                    ref={(el) => {
                      linkRefs.current[i] = el
                    }}
                    className="relative px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href={href}
                    onMouseEnter={() => {
                      setHoveredIndex(i)
                      updateBlob(i)
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
            <Button
              variant="secondary"
              className="hidden md:inline-flex"
              onClick={() => setLoginOpen(true)}
            >
              Login{" "}
              <Kbd data-icon="inline-end" className="translate-x-0.5">
                ⌘K
              </Kbd>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="hidden md:inline-flex"
            >
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                Request Demo{" "}
                <Kbd data-icon="inline-end" className="translate-x-0.5">
                  ⏎
                </Kbd>
              </a>
            </Button>
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
