type PageLoadingBarProps = {
  progress: number
  visible: boolean
}

export default function PageLoadingBar({ progress, visible }: PageLoadingBarProps) {
  if (!visible) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px overflow-hidden"
      aria-hidden
    >
      <div
        className="h-full bg-[#1a73e8] dark:bg-[#8ab4f8]"
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  )
}
