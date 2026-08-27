import type { LineSegment, TerminalLine } from "../lib/commands"

function segmentClass(tone: LineSegment["tone"]): string {
  switch (tone) {
    case "bold":
      return "pt-bold"
    case "dim":
      return "pt-dim"
    case "cyan":
      return "pt-cyan"
    case "error":
      return "pt-error"
    case "default":
    case undefined:
      return ""
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

function SegmentView({ segment }: { segment: LineSegment }) {
  const className = segmentClass(segment.tone)

  if (segment.type === "link") {
    return (
      <a
        href={segment.href}
        target={segment.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={
          segment.href.startsWith("mailto:") ? undefined : "noreferrer noopener"
        }
        className={`pt-link ${className}`.trim()}
      >
        {segment.value}
      </a>
    )
  }

  if (!className) {
    return <>{segment.value}</>
  }

  return <span className={className}>{segment.value}</span>
}

export function TerminalLineView({ line }: { line: TerminalLine }) {
  const empty =
    line.segments.length === 0 ||
    line.segments.every((s) => s.type === "text" && s.value === "")

  if (empty) {
    return <div className="pt-line" aria-hidden />
  }

  return (
    <div className="pt-line">
      {line.segments.map((segment, index) => (
        <SegmentView
          key={`${segment.type}-${index}-${segment.value}`}
          segment={segment}
        />
      ))}
    </div>
  )
}
