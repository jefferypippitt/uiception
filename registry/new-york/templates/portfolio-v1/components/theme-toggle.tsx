"use client"

import { useCallback, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const TOGGLE_COOLDOWN_MS = 650

/** Pure so it can be unit tested without a DOM. */
export function shouldAllowToggle(lastToggleAt: number, now: number): boolean {
  return now - lastToggleAt >= TOGGLE_COOLDOWN_MS
}

function isEditableTarget(target: EventTarget | null) {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function ThemeKeyboardShortcut() {
  const { resolvedTheme, setTheme } = useTheme()
  const lastToggleAt = useRef<number>(0)

  const toggleTheme = useCallback(() => {
    const now = Date.now()
    if (!shouldAllowToggle(lastToggleAt.current, now)) return
    lastToggleAt.current = now
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
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
