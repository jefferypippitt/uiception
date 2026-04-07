/** Type speed eased between these bounds (ms); narrow span + gentle curve = snappy, even cadence */
export const TYPE_CHAR_MS_SLOW = 40
export const TYPE_CHAR_MS_FAST = 18

/** Delete eased between these bounds (ms); quick bulk with a soft lead-in */
export const DELETE_CHAR_MS_SLOW = 30
export const DELETE_CHAR_MS_FAST = 11

/** How long the full placeholder stays visible before deleting */
export const HOLD_MS = 1500

/** Brief pause after clearing before the next phrase */
export const BETWEEN_MS = 280

export const PLACEHOLDER_PROMPTS = [
  "Compare pricing and plans…",
  "How do team seats and billing work?",
  "Book a product demo this week",
  "Integrate with our REST API",
  "What security and compliance do you offer?",
  "Start a trial—no credit card required",
] as const
