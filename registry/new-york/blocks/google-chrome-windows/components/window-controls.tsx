import { Copy, Minus, X } from "lucide-react"

const iconClass = "size-3.5 shrink-0 stroke-[1.5]"

export default function WindowControls() {
  return (
    <div className="gcw-win-controls" aria-hidden>
      <button type="button" tabIndex={-1} className="gcw-win-btn gcw-win-btn-minimize">
        <Minus className={iconClass} />
      </button>
      <button type="button" tabIndex={-1} className="gcw-win-btn gcw-win-btn-maximize">
        <Copy className={iconClass} />
      </button>
      <button type="button" tabIndex={-1} className="gcw-win-btn gcw-win-btn-close">
        <X className={iconClass} />
      </button>
    </div>
  )
}
