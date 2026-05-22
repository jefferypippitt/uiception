export const HERO_V8_TRUST_LABEL = "Trusted by curious teams everywhere"

export const CAROUSEL_PAGE_SIZE = 3

export const CAROUSEL_EXIT_ANIM_MS = 260
export const CAROUSEL_ENTER_ANIM_MS = 280

export type CarouselColumn = 1 | 2 | 3

export const CAROUSEL_COLUMNS: readonly CarouselColumn[] = [1, 2, 3]

export const toCarouselColumn = (columnIndex: number): CarouselColumn =>
  (columnIndex + 1) as CarouselColumn

export const CAROUSEL_COLUMN_FLIP_MS =
  CAROUSEL_EXIT_ANIM_MS + CAROUSEL_ENTER_ANIM_MS

export const CAROUSEL_FLIP_MS =
  CAROUSEL_COLUMN_FLIP_MS * CAROUSEL_PAGE_SIZE
export const CAROUSEL_HOLD_MS = 3200
export const CAROUSEL_CYCLE_MS = CAROUSEL_HOLD_MS + CAROUSEL_FLIP_MS
