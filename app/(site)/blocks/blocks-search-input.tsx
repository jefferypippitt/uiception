"use client"

import { useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"

export function BlocksSearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const q = searchParams.get("q") ?? ""

  const update = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search categories..."
        value={q}
        onChange={(e) => update(e.target.value)}
        className="pl-8 pr-8"
      />
      {q && (
        <button
          onClick={() => update("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
