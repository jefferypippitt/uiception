"use client"

import { useStockChartAnimation } from "../hooks/use-stock-chart-animation"

const LINE_PATH = [
  "M 0,155",
  "C 18,148 28,128 40,130",
  "C 52,132 62,147 75,145",
  "C 88,143 98,88 115,92",
  "C 130,96 142,152 155,150",
  "C 168,148 180,133 195,135",
  "C 208,137 222,112 235,115",
  "C 248,118 258,163 270,160",
  "C 282,157 292,138 305,140",
  "C 318,142 330,80 345,84",
  "C 358,88 372,108 385,105",
  "C 398,102 408,86 420,88",
  "C 432,90 442,143 455,140",
  "C 466,137 478,70 490,73",
  "C 500,76 518,170 535,175",
  "C 550,180 562,152 575,150",
  "C 588,148 602,96 615,98",
  "C 628,100 638,66 650,68",
  "C 662,70 678,88 690,86",
  "C 702,84 718,45 730,48",
  "C 742,51 760,65 775,62",
  "C 788,59 808,40 820,43",
  "C 832,46 848,34 860,36",
].join(" ")

export default function StockChart() {
  const { lineRef } = useStockChartAnimation()

  return (
    <svg
      viewBox="0 0 860 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full text-primary"
      aria-label="Animated stock performance chart"
      role="img"
    >
      <path
        ref={lineRef}
        d={LINE_PATH}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
