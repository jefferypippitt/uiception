"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

const EMAIL = "jefferyspippitt@gmail.com"

export function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetRef.current) clearTimeout(resetRef.current)
    }
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (resetRef.current) clearTimeout(resetRef.current)
      resetRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      onClick={handleCopy}
      className="h-auto cursor-pointer p-0 text-[0.9375rem]"
      aria-label={copied ? "Email copied" : `Copy email ${EMAIL}`}
    >
      {copied ? "Copied" : "email"}
    </Button>
  )
}
