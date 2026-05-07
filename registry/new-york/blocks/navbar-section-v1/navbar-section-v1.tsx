"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden
      className={cn("size-6 shrink-0", className)}
      height={32}
      src="/icon0.svg"
      width={32}
    />
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex size-4 flex-col items-center justify-center gap-[4px]">
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "translate-y-[5px] rotate-45" : "",
        )}
      />
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "opacity-0 scale-x-0" : "",
        )}
      />
      <span
        className={cn(
          "block h-px w-4 bg-current transition-all duration-300 ease-in-out",
          open ? "-translate-y-[5px] -rotate-45" : "",
        )}
      />
    </div>
  )
}

const NAV_LINKS = [
  { label: "How it works", href: "#", inPage: true },
  { label: "Source", href: "#", external: true },
  { label: "Sign in", href: "#", inPage: true },
]

const linkClass = "text-muted-foreground text-sm transition-colors hover:text-foreground"

export default function NavbarSectionV1() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 border-b bg-background/80 backdrop-blur transition-colors duration-300",
        scrolled || menuOpen ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          aria-label="Homepage"
          className="inline-flex items-center gap-2 font-medium tracking-tight"
          href="#"
        >
          <BrandLogo />
          <span className="text-lg tracking-tight">uiception</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ label, href, external, inPage }) => (
            <a
              key={label}
              className={linkClass}
              href={href}
              onClick={inPage ? (e) => e.preventDefault() : undefined}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {label}
            </a>
          ))}
          <Button asChild className="h-8 gap-1 rounded-4xl px-3 active:not-aria-[haspopup]:translate-y-px">
            <Link href="#">Get started</Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile menu — grid-rows trick for smooth height transition */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out md:hidden",
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-6 py-5">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, external, inPage }, i) => (
                <a
                  key={label}
                  className={cn(
                    linkClass,
                    "py-2 transition-all duration-300",
                    menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                  )}
                  href={href}
                  onClick={(e) => { if (inPage) e.preventDefault(); setMenuOpen(false) }}
                  style={{ transitionDelay: menuOpen ? `${i * 40 + 60}ms` : "0ms" }}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {label}
                </a>
              ))}
              <div
                className={cn(
                  "pt-2 transition-all duration-300",
                  menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: menuOpen ? `${NAV_LINKS.length * 40 + 60}ms` : "0ms" }}
              >
                <Button asChild className="h-8 rounded-4xl px-3 active:not-aria-[haspopup]:translate-y-px">
                  <Link href="#" onClick={() => setMenuOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
