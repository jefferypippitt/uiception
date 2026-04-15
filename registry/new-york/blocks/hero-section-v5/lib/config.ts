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
  "Show me 3-bedroom homes under $600k in Austin.",
  "What are the best neighbourhoods for young families?",
  "How much do I need for a down payment on a $450k home?",
  "What is the current average price per sqft in Miami?",
  "Can I schedule a viewing for this weekend?",
  "What schools are near homes in this zip code?",
] as const
