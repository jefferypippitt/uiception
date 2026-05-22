import { Mic, Plus, ScanSearch, Search, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

import "./google-home-preview.css"

const iconClass = "size-[18px] shrink-0 stroke-[1.75]"

type GoogleHomePreviewProps = {
  className?: string
}

function GoogleWordmark() {
  return (
    <h1
      className="mb-7 flex items-baseline gap-0 font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[clamp(2.75rem,8vw,4.25rem)] leading-none font-normal tracking-[-0.04em] select-none"
      aria-hidden
    >
      <span style={{ color: "var(--ghp-logo-g)" }}>G</span>
      <span style={{ color: "var(--ghp-logo-o1)" }}>o</span>
      <span style={{ color: "var(--ghp-logo-o2)" }}>o</span>
      <span style={{ color: "var(--ghp-logo-g2)" }}>g</span>
      <span style={{ color: "var(--ghp-logo-l)" }}>l</span>
      <span style={{ color: "var(--ghp-logo-e)" }}>e</span>
    </h1>
  )
}

export default function GoogleHomePreview({ className }: GoogleHomePreviewProps) {
  return (
    <div
      className={cn(
        "ghp-root flex size-full flex-col items-center justify-start bg-(--ghp-bg) px-4 pt-[16%] pb-10",
        className
      )}
      aria-hidden
    >
      <GoogleWordmark />

      <div
        className="flex w-full max-w-xl items-center gap-2 rounded-full border border-(--ghp-bar-border) bg-(--ghp-bar-bg) py-2.5 pr-2 pl-4 shadow-(--ghp-bar-shadow)"
      >
        <Plus className={cn(iconClass, "text-(--ghp-icon)")} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-(--ghp-placeholder)">
          Ask Google
        </span>
        <button
          type="button"
          tabIndex={-1}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--ghp-icon)"
          aria-hidden
        >
          <Mic className={iconClass} />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border-none bg-transparent p-0 text-(--ghp-icon)"
          aria-hidden
        >
          <ScanSearch className={iconClass} />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border-none bg-(--ghp-ai-bg) px-3.5 text-[0.8125rem] font-medium text-(--ghp-ai-fg)"
          aria-hidden
        >
          <span className="relative flex size-[18px] items-center justify-center">
            <Search
              className="size-3.5 stroke-2 text-(--ghp-ai-icon)"
              aria-hidden
            />
            <Sparkles
              className="absolute -top-0.5 -right-0.5 size-2.5 fill-(--ghp-ai-icon) stroke-none text-(--ghp-ai-icon)"
              aria-hidden
            />
          </span>
          AI Mode
        </button>
      </div>
    </div>
  )
}
