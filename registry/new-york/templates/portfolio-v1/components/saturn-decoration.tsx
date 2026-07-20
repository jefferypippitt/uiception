import type { CSSProperties } from "react"

import "../styles/saturn-decoration.css"

type Moon = {
  size: string
  inset: string
  duration: string
  phase: number
  look?: "tone" | "bright" | "soft"
  reverse?: boolean
}

const MOONS: Moon[] = [
  { size: "0.4rem", inset: "2%", duration: "20s", phase: 0.08 },
  { size: "0.22rem", inset: "14%", duration: "14s", phase: 0.42 },
  { size: "0.21rem", inset: "-4%", duration: "28s", phase: 0.71, look: "tone", reverse: true },
  { size: "0.18rem", inset: "22%", duration: "11s", phase: 0.33 },
  { size: "0.17rem", inset: "30%", duration: "9s", phase: 0.55, look: "bright" },
  { size: "0.12rem", inset: "38%", duration: "6.5s", phase: 0.88, look: "bright" },
  { size: "0.1rem", inset: "44%", duration: "5s", phase: 0.23, look: "soft" },
]

function EclipseMoons() {
  return (
    <>
      {MOONS.map((moon, i) => (
        <div
          key={i}
          className={
            moon.reverse
              ? "saturn-decoration__orbit saturn-decoration__orbit--reverse"
              : "saturn-decoration__orbit"
          }
          style={
            {
              "--moon-size": moon.size,
              "--orbit-inset": moon.inset,
              "--orbit-duration": moon.duration,
              "--orbit-phase": moon.phase,
            } as CSSProperties
          }
        >
          <span className="saturn-decoration__moon-pivot">
            <span
              className={
                moon.look
                  ? `saturn-decoration__moon saturn-decoration__moon--${moon.look}`
                  : "saturn-decoration__moon"
              }
            >
              <span className="saturn-decoration__glare" />
            </span>
          </span>
        </div>
      ))}
    </>
  )
}

function PlanetFace() {
  return (
    <div className="saturn-decoration__planet">
      <span className="saturn-decoration__glare" />
    </div>
  )
}

export function SaturnDecoration() {
  return (
    <div className="saturn-decoration not-typeset" aria-hidden="true">
      <div className="saturn-decoration__planet-under">
        <PlanetFace />
      </div>

      <div className="saturn-decoration__eclipse">
        <div className="saturn-decoration__plane">
          <div className="saturn-decoration__rings" />
          <EclipseMoons />
        </div>
      </div>

      <div className="saturn-decoration__planet-cap">
        <PlanetFace />
      </div>
    </div>
  )
}
