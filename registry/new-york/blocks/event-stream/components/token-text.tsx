import { useMemo } from "react"

// Splits text into plain segments and JSON number-literal segments.
// Swap this component to add syntax colours, highlights, or diff markers.
function tokenize(text: string): Array<{ t: string; num: boolean }> {
  const out: Array<{ t: string; num: boolean }> = []
  const re = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ t: text.slice(last, m.index), num: false })
    out.push({ t: m[0], num: true })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ t: text.slice(last), num: false })
  return out
}

interface TokenTextProps {
  text: string
}

export default function TokenText({ text }: TokenTextProps) {
  const tokens = useMemo(() => tokenize(text), [text])

  return (
    <>
      {tokens.map((tok, i) =>
        tok.num ? (
          <span key={i} className="tabular-nums">
            {tok.t}
          </span>
        ) : (
          tok.t
        )
      )}
    </>
  )
}
