"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react"

import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mediaOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? ""
const SITE_NAME = "uiception"
const LOGO_SRC = `${mediaOrigin}/images/blocks/navbar-section-v10/logo.svg`
const LOGO_HREF = "#"
const CTA = { label: "Sign Up", href: "#" }

const PRIMARY_LINKS = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
] as const

const FOOTER_COLUMNS = [
  {
    label: "Connect",
    links: [
      { label: "GitHub", href: "#" },
      { label: "X", href: "#" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
] as const

const primaryLinkClass =
  "text-lg font-medium leading-tight text-foreground transition-colors hover:text-muted-foreground"

const footerLinkClass =
  "text-sm text-foreground transition-colors hover:text-muted-foreground"

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN = [0.4, 0, 1, 1] as const

const cardVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.88,
    y: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: EASE_OUT,
      opacity: { duration: 0.28, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -8,
    transition: {
      duration: 0.22,
      ease: EASE_IN,
    },
  },
}

const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE_IN },
  },
}

const reducedCardVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

function BrandMark({ className }: { className?: string }) {
  return (
    <>
      <Image
        src={LOGO_SRC}
        alt=""
        width={20}
        height={20}
        unoptimized
        aria-hidden
        className="size-5 shrink-0"
      />
      <span className={cn("text-base font-medium", className)}>
        {SITE_NAME}
      </span>
    </>
  )
}

function BrandChip() {
  return (
    <Button asChild variant="secondary" size="lg">
      <Link
        href={LOGO_HREF}
        aria-label={`${SITE_NAME} home`}
        onClick={(e) => e.preventDefault()}
      >
        <BrandMark />
      </Link>
    </Button>
  )
}

function NavCard({
  onClose,
  reduceMotion,
}: {
  onClose: () => void
  reduceMotion: boolean
}) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClose()
  }

  return (
    <motion.nav
      aria-label="Primary"
      variants={reduceMotion ? reducedCardVariants : cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ transformOrigin: "top left" }}
      className="w-[min(100vw-3rem,26.25rem)] origin-top-left rounded-md bg-muted p-2.5 will-change-transform"
    >
      <div className="flex items-center justify-between gap-3 px-1.5 pb-4 pt-1">
        <Link
          href={LOGO_HREF}
          aria-label={`${SITE_NAME} home`}
          className="inline-flex items-center gap-2.5"
          onClick={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          <BrandMark />
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="default"
          aria-label="Close menu"
          onClick={onClose}
        >
          <XIcon strokeWidth={1.5} aria-hidden />
        </Button>
      </div>

      <ul className="flex flex-col gap-6 px-1.5 pb-6">
        {PRIMARY_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={primaryLinkClass}
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-8 px-1.5 pb-2">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.label}>
            <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
              {column.label}
            </p>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={footerLinkClass}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.nav>
  )
}

export default function NavbarSectionV10() {
  const [menuOpen, setMenuOpen] = useState(false)
  const leftClusterRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (leftClusterRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [menuOpen])

  return (
    <>
      <AnimatePresence>
        {menuOpen ? (
          <motion.button
            key="nav-backdrop"
            type="button"
            aria-label="Close menu"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-background/40"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <header>
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
            <div ref={leftClusterRef} className="relative z-50">
              {/* Anchor stays in flow so the header never reflows */}
              <div
                className={cn(
                  "flex items-center gap-1.5",
                  menuOpen && "invisible"
                )}
                aria-hidden={menuOpen}
              >
                <BrandChip />
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  aria-expanded={menuOpen}
                  aria-label="Open menu"
                  tabIndex={menuOpen ? -1 : undefined}
                  onClick={() => setMenuOpen(true)}
                >
                  <MenuIcon strokeWidth={1.5} aria-hidden />
                </Button>
              </div>

              <AnimatePresence>
                {menuOpen ? (
                  <div
                    key="nav-card"
                    className="absolute top-0 left-0 z-50"
                  >
                    <NavCard
                      onClose={() => setMenuOpen(false)}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                ) : null}
              </AnimatePresence>
            </div>

            <Button
              asChild
              className={cn(
                "relative z-50",
                menuOpen && "invisible sm:visible"
              )}
              aria-hidden={menuOpen}
              tabIndex={menuOpen ? -1 : undefined}
            >
              <Link href={CTA.href} onClick={(e) => e.preventDefault()}>
                {CTA.label}
              </Link>
            </Button>
          </div>
        </header>
      </div>
    </>
  )
}
