import type { BlockCategoryId } from "./blocks"

export type BlockPeriodicCell = {
  id: BlockCategoryId
  z: number
  symbol: string
  row: number
  col: number
  colSpan?: number
}

export const blockPeriodicCells: BlockPeriodicCell[] = [
  // Row 1 
  { id: "navbar",            z: 1,  symbol: "Nb", row: 1, col: 1  },
  { id: "hero-section",      z: 2,  symbol: "Hs", row: 1, col: 10 },

  // Row 2
  { id: "brands",            z: 3,  symbol: "Br", row: 2, col: 1  },
  { id: "features",          z: 4,  symbol: "Fe", row: 2, col: 2  },
  { id: "integrations",      z: 5,  symbol: "In", row: 2, col: 7  },
  { id: "how-it-works",      z: 6,  symbol: "Hi", row: 2, col: 8  },
  { id: "value-proposition", z: 7,  symbol: "Vp", row: 2, col: 9  },
  { id: "case-study",        z: 8,  symbol: "Cs", row: 2, col: 10 },

  // Row 3
  { id: "testimonials",      z: 9,  symbol: "Te", row: 3, col: 1  },
  { id: "stats",             z: 10, symbol: "St", row: 3, col: 2  },
  { id: "waitlist",          z: 11, symbol: "Wl", row: 3, col: 3  },
  { id: "social-proof",      z: 12, symbol: "Sp", row: 3, col: 4  },
  { id: "partners",          z: 13, symbol: "Pt", row: 3, col: 5  },
  { id: "pricing",           z: 14, symbol: "Pr", row: 3, col: 6  },
  { id: "faq",               z: 15, symbol: "Fq", row: 3, col: 7  },
  { id: "cta",               z: 16, symbol: "Ct", row: 3, col: 8  },
  { id: "about-us",          z: 17, symbol: "Au", row: 3, col: 9  },
  { id: "resources",         z: 18, symbol: "Rs", row: 3, col: 10 },

  // Row 4
  { id: "footer",            z: 19, symbol: "Fo", row: 4, col: 1  },
  { id: "changelog",         z: 20, symbol: "Cg", row: 4, col: 2  },
  { id: "team",              z: 21, symbol: "Tm", row: 4, col: 3  },
  { id: "contact",           z: 22, symbol: "Co", row: 4, col: 4  },
  { id: "blog",              z: 23, symbol: "Bl", row: 4, col: 5  },
  { id: "gallery",           z: 24, symbol: "Gl", row: 4, col: 6  },
  { id: "video",             z: 25, symbol: "Vi", row: 4, col: 7  },
  { id: "timeline",          z: 26, symbol: "Tl", row: 4, col: 8  },
  { id: "comparison",        z: 27, symbol: "Cp", row: 4, col: 9  },
  { id: "newsletter",        z: 28, symbol: "Nw", row: 4, col: 10 },

  // Extended section
  { id: "backgrounds",       z: 29, symbol: "Bg", row: 6, col: 1  },
  { id: "sidebar",           z: 30, symbol: "Sb", row: 6, col: 2  },
  { id: "banner",            z: 31, symbol: "Bn", row: 6, col: 3  },
]

const byId = Object.fromEntries(blockPeriodicCells.map((c) => [c.id, c])) as Record<
  BlockCategoryId,
  BlockPeriodicCell
>

export function getBlockPeriodicCell(id: BlockCategoryId): BlockPeriodicCell {
  return byId[id]
}
