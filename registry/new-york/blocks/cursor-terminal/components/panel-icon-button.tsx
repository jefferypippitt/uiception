import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function PanelIconButton({
  children,
  label,
  hoverDanger,
  className,
}: {
  children: ReactNode
  label: string
  hoverDanger?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      tabIndex={-1}
      className={cn(
        "flex size-7 items-center justify-center rounded text-[#c8c8c8] transition-colors",
        hoverDanger ? "hover:bg-[#c42b1c]/90 hover:text-white" : "hover:bg-white/8",
        className,
      )}
    >
      {children}
    </button>
  )
}
