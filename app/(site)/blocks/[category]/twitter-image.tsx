import { ImageResponse } from "next/og"

import { blockCategories } from "@/lib/blocks"
import { blockPeriodicCells } from "@/lib/block-periodic-layout"
import { META_THEME_COLORS, siteConfig } from "@/lib/config"

export const alt = "uiception block category"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categoryId } = await params
  const category = blockCategories.find((item) => item.id === categoryId)
  const cell = blockPeriodicCells.find((item) => item.id === categoryId)

  const title = category?.title ?? categoryId
  const symbol = cell?.symbol ?? "??"
  const atomicNumber = cell?.z ?? 0
  const count = category?.versions.length ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: META_THEME_COLORS.dark,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            border: "2px solid #27272a",
            borderRadius: 24,
            padding: "48px 64px",
            width: 400,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>
            {atomicNumber}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {symbol}
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 16 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#71717a",
              marginTop: 8,
            }}
          >
            {count} {count === 1 ? "block" : "blocks"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: "#a1a1aa",
            letterSpacing: 2,
          }}
        >
          {siteConfig.name.toUpperCase()}
        </div>
      </div>
    ),
    { ...size }
  )
}
