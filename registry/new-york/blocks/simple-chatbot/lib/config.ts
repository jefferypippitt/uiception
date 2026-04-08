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
  "Explain the concept of quantum entanglement.",
  "Why does time slow down near a black hole?",
  "What is the Fermi Paradox and why does it matter?",
  "How did the universe begin before the Big Bang?",
  "What would happen if you fell into a black hole?",
  "Is mathematics discovered or invented by humans?",
] as const
