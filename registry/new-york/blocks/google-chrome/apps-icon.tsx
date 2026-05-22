const SQUARES = [
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
  "#4285F4",
  "#EA4335",
  "#34A853",
  "#FBBC05",
  "#EA4335",
] as const

export default function AppsIcon() {
  return (
    <span className="grid shrink-0 grid-cols-3 gap-px" aria-hidden>
      {SQUARES.map((fill, i) => (
        <span
          key={i}
          className="size-1 rounded-[0.5px]"
          style={{ backgroundColor: fill }}
        />
      ))}
    </span>
  )
}
