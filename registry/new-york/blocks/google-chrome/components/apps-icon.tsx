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
    <span className="gc-apps-icon" aria-hidden>
      {SQUARES.map((fill, i) => (
        <span key={i} className="gc-apps-square" style={{ backgroundColor: fill }} />
      ))}
    </span>
  )
}
