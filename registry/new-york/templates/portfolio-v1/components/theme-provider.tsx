"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

import { ThemeKeyboardShortcut } from "./theme-toggle"

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeKeyboardShortcut />
      {children}
    </NextThemesProvider>
  )
}
