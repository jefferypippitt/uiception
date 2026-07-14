"use client"

import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <nav className="flex items-center gap-1">
          {siteConfig.navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
