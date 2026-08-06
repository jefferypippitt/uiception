"use client"

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import { flushSync } from "react-dom"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const themes = [
  { value: "system", label: "System theme", icon: MonitorIcon },
  { value: "light", label: "Light theme", icon: SunIcon },
  { value: "dark", label: "Dark theme", icon: MoonIcon },
] as const

type ThemeValue = (typeof themes)[number]["value"]

const emptySubscribe = () => () => {}

const TOGGLE_COOLDOWN_MS = 650

/** Pure so it can be unit tested without a DOM. */
export function shouldAllowToggle(lastToggleAt: number, now: number): boolean {
  return now - lastToggleAt >= TOGGLE_COOLDOWN_MS
}

/** Returns true when the OS/browser has requested reduced motion. */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

type VtDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>
  }
}

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

function isEditableTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

/** Canvas UI pattern: set theme inside flushSync (± view transition). */
function applyTheme(setTheme: (theme: string) => void, next: string) {
  const doc = document as VtDocument
  if (doc.startViewTransition && !prefersReducedMotion()) {
    doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    return
  }
  setTheme(next)
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useIsClient()

  const activeTheme = (mounted ? theme : "system") as ThemeValue | undefined

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center rounded-full border border-border bg-muted/60 p-0.5"
    >
      {themes.map(({ value, label, icon: Icon }) => {
        const isActive = activeTheme === value

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => applyTheme(setTheme, value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}

export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const lastToggleAt = useRef<number>(0)

  const toggleTheme = useCallback(() => {
    const now = Date.now()
    if (!shouldAllowToggle(lastToggleAt.current, now)) return
    lastToggleAt.current = now
    applyTheme(setTheme, resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key !== "d" && event.key !== "D") return
      if (isEditableTarget(event.target)) return

      event.preventDefault()
      toggleTheme()
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [toggleTheme])

  return null
}
