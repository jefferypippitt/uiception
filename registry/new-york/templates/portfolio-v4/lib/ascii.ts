/** FIGlet-style banner — show only when the terminal is wide enough. */
export const ASCII_ART = [
  "     _             ____             ",
  "    | | ___  _ __ |  _ \\  ___   ___ ",
  " _  | |/ _ \\| '_ \\| | | |/ _ \\ / _ \\",
  "| |_| | (_) | | | | |_| | (_) |  __/",
  " \\___/ \\___/|_| |_|____/ \\___/ \\___|",
] as const

/** Skip the banner below this column count. */
export const ASCII_MIN_COLS = 43

export function shouldShowAscii(cols: number): boolean {
  return cols >= ASCII_MIN_COLS
}
