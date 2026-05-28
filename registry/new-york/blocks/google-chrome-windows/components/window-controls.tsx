import { Copy, Minus, X } from "lucide-react"

const iconClass = "size-3.5 shrink-0 stroke-[1.5]"

export default function WindowControls() {
  return (
    <div
      className="ml-auto flex h-11 shrink-0 items-stretch self-stretch"
      aria-hidden
    >
      <button
        type="button"
        tabIndex={-1}
        className="flex h-full w-11 items-center justify-center rounded-none border-none bg-transparent p-0 text-(--gcw-win-fg) transition-[background-color,color] duration-120 ease-out hover:bg-(--gcw-win-hover-muted)"
      >
        <Minus className={iconClass} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="flex h-full w-11 items-center justify-center rounded-none border-none bg-transparent p-0 text-(--gcw-win-fg) transition-[background-color,color] duration-120 ease-out hover:bg-(--gcw-win-hover-muted)"
      >
        <Copy className={iconClass} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="flex h-full w-11 items-center justify-center rounded-none border-none bg-transparent p-0 text-(--gcw-win-fg) transition-[background-color,color] duration-120 ease-out hover:bg-(--gcw-win-hover-close) hover:text-(--gcw-win-hover-close-fg)"
      >
        <X className={iconClass} />
      </button>
    </div>
  )
}
